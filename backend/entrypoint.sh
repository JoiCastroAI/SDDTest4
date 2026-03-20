#!/usr/bin/env bash
set -e

export PYTHONPATH=/app

echo "Running Alembic migrations..."
# Stamp if alembic_version table doesn't exist but app tables do (migrating from create_all)
python -c "
import asyncio, asyncpg, os, re

async def check():
    url = os.environ.get('DATABASE_URL', '')
    # Convert SQLAlchemy URL to asyncpg format
    dsn = re.sub(r'^postgresql\+asyncpg://', 'postgresql://', url)
    conn = await asyncpg.connect(dsn)
    has_version = await conn.fetchval(
        \"SELECT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name='alembic_version')\"
    )
    has_companies = await conn.fetchval(
        \"SELECT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name='companies')\"
    )
    await conn.close()
    if not has_version and has_companies:
        print('STAMP_NEEDED')

asyncio.run(check())
" | grep -q 'STAMP_NEEDED' && {
    echo "Tables exist but no alembic_version — stamping current state..."
    alembic stamp head
}

alembic upgrade head

echo "Starting application..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
