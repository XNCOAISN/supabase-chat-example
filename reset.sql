drop policy "Allow authenticated select access" on public.users;
drop policy "Allow individual insert access" on public.users;
drop policy "Allow individual update access" on public.users;
drop policy "Allow authorized select access" on public.channels;
drop policy "Allow individual insert access" on public.channels;
drop policy "Allow individual delete access" on public.channels;
drop policy "Allow authorized delete access" on public.channels;
drop policy "Allow authorized select access" on public.messages;
drop policy "Allow individual insert access" on public.messages;
drop policy "Allow individual update access" on public.messages;
drop policy "Allow individual delete access" on public.messages;
drop policy "Allow authorized delete access" on public.messages;
drop policy "Allow individual select access" on public.user_roles;

drop trigger if exists on_auth_user_created on auth.users;
drop trigger if exists on_channel_created on public.channels;

drop function if exists public.authorize;
drop function if exists public.handle_new_user;
drop function if exists public.handle_new_channel;

drop table public.role_permissions CASCADE;
drop table public.messages CASCADE;
drop table public.user_roles CASCADE;
drop table public.channels CASCADE;
drop table public.users CASCADE;


drop type public.app_permission CASCADE;
drop type public.app_role CASCADE;
drop type public.user_status CASCADE;

delete from auth.users;
