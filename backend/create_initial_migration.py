#!/usr/bin/env python3

import os
import sys
import subprocess
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

# 设置工作目录
script_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(script_dir)

# 创建迁移
try:
    # 初始化Alembic（如果尚未初始化）
    if not os.path.exists(os.path.join("alembic", "versions")):
        os.makedirs(os.path.join("alembic", "versions"), exist_ok=True)
    
    # 生成初始迁移
    subprocess.run(["alembic", "revision", "--autogenerate", "-m", "Initial migration"], check=True)
    print("Successfully created initial migration")
    
except Exception as e:
    print(f"Error creating migration: {str(e)}")
    sys.exit(1) 