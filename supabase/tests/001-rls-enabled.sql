begin;

select plan(2);

select tests.rls_enabled('public');

select has_function('tests', 'create_test_user', 'custom helper exists');

select * from finish();
rollback;
