-- Script para inserir usuário de teste com email: vitorthome@alunos.utfpr.edu.br

-- Inserir Address (endereço padrão)
INSERT INTO tb_address (id, street, number, complement, city, state, postal_code, created_at, updated_at)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'Rua de Teste',
    '123',
    'Apto 1',
    'Curitiba',
    'PR',
    '80000000',
    NOW(),
    NOW()
) ON CONFLICT DO NOTHING;

-- Inserir Person
INSERT INTO tb_people (id, name, phone, email, cpf, id_address, created_at, updated_at)
VALUES (
    'b0000000-0000-0000-0000-000000000001',
    'Vitor Thomé',
    '41999999999',
    'vitorthome@alunos.utfpr.edu.br',
    '12345678901',
    'a0000000-0000-0000-0000-000000000001',
    NOW(),
    NOW()
) ON CONFLICT DO NOTHING;

-- Inserir Voluntary
INSERT INTO tb_voluntaries (id, password, is_active, id_person, created_at, updated_at)
VALUES (
    'c0000000-0000-0000-0000-000000000001',
    '1234',
    true,
    'b0000000-0000-0000-0000-000000000001',
    NOW(),
    NOW()
) ON CONFLICT DO NOTHING;

-- Confirmação
SELECT 'Usuário de teste inserido com sucesso!' as mensagem;
SELECT id, name, email FROM tb_people WHERE email = 'vitorthome@alunos.utfpr.edu.br';
