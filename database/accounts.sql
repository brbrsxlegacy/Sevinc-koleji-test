-- Run once in Supabase SQL Editor. Private tables: browser roles have no access.
create table if not exists public.teacher_profiles (
 id uuid primary key default gen_random_uuid(), code_hash text unique not null,
 name text not null, active boolean not null default false,
 created_at timestamptz not null default now()
);
create table if not exists public.test_usage (
 id uuid primary key default gen_random_uuid(), account_id uuid not null references public.teacher_profiles(id),
 state text not null default 'pending' check(state in ('pending','success','failed')),
 day date not null default (now() at time zone 'Europe/Istanbul')::date,
 created_at timestamptz not null default now()
);
create index if not exists usage_account_day on public.test_usage(account_id,day);
alter table public.teacher_profiles enable row level security;
alter table public.test_usage enable row level security;
revoke all on public.teacher_profiles,public.test_usage from anon,authenticated;
grant all on public.teacher_profiles,public.test_usage to service_role;
create or replace function public.reserve_test(p_account uuid) returns jsonb language plpgsql security definer set search_path=public as $$
declare p teacher_profiles; n integer; reservation uuid;
begin
 select * into p from teacher_profiles where id=p_account for update;
 if not found or not p.active then raise exception 'account_disabled'; end if;
 select count(*) into n from test_usage where account_id=p_account and day=(now() at time zone 'Europe/Istanbul')::date and (state='success' or (state='pending' and created_at>now()-interval '10 minutes'));
 if exists(select 1 from test_usage where account_id=p_account and state='pending' and created_at>now()-interval '10 minutes') then return jsonb_build_object('allowed',false,'busy',true); end if;
 insert into test_usage(account_id) values(p_account) returning id into reservation;
 return jsonb_build_object('allowed',true,'reservation',reservation,'used',n+1);
end $$;
revoke all on function public.reserve_test(uuid) from public,anon,authenticated;
grant execute on function public.reserve_test(uuid) to service_role;
create table if not exists public.account_attempts (ip_hash text not null,bucket bigint not null,n integer not null,primary key(ip_hash,bucket));
alter table public.account_attempts enable row level security;
revoke all on public.account_attempts from anon,authenticated;
grant all on public.account_attempts to service_role;
create or replace function public.allow_account_attempt(p_ip text) returns boolean language plpgsql security definer set search_path=public as $$
declare attempts integer; b bigint := floor(extract(epoch from now())/900);
begin
 delete from account_attempts where bucket<b-96;
 insert into account_attempts(ip_hash,bucket,n) values(p_ip,b,1) on conflict(ip_hash,bucket) do update set n=account_attempts.n+1 returning n into attempts;
 return attempts<=20;
end $$;
revoke all on function public.allow_account_attempt(text) from public,anon,authenticated;
grant execute on function public.allow_account_attempt(text) to service_role;
