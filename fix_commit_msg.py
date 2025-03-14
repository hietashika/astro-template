import re

def fixer(commit):
    # コミットメッセージを取得
    message = commit.message.decode('utf-8')

    # [prefix] と絵文字の間の余分な空白を削除
    # 例: [chore]   -> [chore]
    pattern = r'\[(chore|docs|feat|fix|refactor|style|test)\]\s{2,}(.)'
    replacement = r'[\1] \2'
