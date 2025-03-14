import re

def fix_commit_message(commit, metadata):
    # �R�~�b�g���b�Z�[�W���擾
    message = commit.message.decode('utf-8')
    
    # [prefix] �ƊG�����̊Ԃ̗]���ȋ󔒂��폜
    # ��: [chore]   -> [chore] 
    pattern = r'\[(chore|docs|feat|fix|refactor|style|test)\]\s{2,}(.)'
    replacement = r'[\1] \2'
    corrected_message = re.sub(pattern, replacement, message)
    
    # �v���t�B�b�N�X�̑O�̗]���ȃX�y�[�X���폜
    # ��: '   [hoge]' -> '[hoge]'
    pattern2 = r'^\s+(\[(chore|docs|feat|fix|refactor|style|test)\])'
    replacement2 = r'\1'
    corrected_message = re.sub(pattern2, replacement2, corrected_message)
    
    # �C���������b�Z�[�W���R�~�b�g�ɐݒ�
    commit.message = corrected_message.encode('utf-8')
