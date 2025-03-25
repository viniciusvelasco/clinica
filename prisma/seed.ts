import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    // Verifica se já existe um usuário admin
    const adminExists = await prisma.user.findFirst({
      where: {
        email: 'admin@clinica.com',
      },
    });

    if (!adminExists) {
      // Cria o usuário admin
      const hashedPassword = await hash('admin123', 12);
      
      await prisma.user.create({
        data: {
          name: 'Administrador',
          email: 'admin@clinica.com',
          password: hashedPassword,
          role: 'admin',
        },
      });
      
      console.log('✅ Usuário administrador criado com sucesso');
    } else {
      console.log('👍 Usuário administrador já existe');
    }

    // Cria um médico de exemplo
    const doctorExists = await prisma.user.findFirst({
      where: {
        email: 'medico@clinica.com',
      },
    });

    if (!doctorExists) {
      const hashedPassword = await hash('medico123', 12);
      
      await prisma.user.create({
        data: {
          name: 'Dr. João Silva',
          email: 'medico@clinica.com',
          password: hashedPassword,
          role: 'doctor',
        },
      });
      
      console.log('✅ Usuário médico criado com sucesso');
    } else {
      console.log('👍 Usuário médico já existe');
    }

    // Cria um recepcionista de exemplo
    const receptionistExists = await prisma.user.findFirst({
      where: {
        email: 'recepcao@clinica.com',
      },
    });

    if (!receptionistExists) {
      const hashedPassword = await hash('recepcao123', 12);
      
      await prisma.user.create({
        data: {
          name: 'Maria Oliveira',
          email: 'recepcao@clinica.com',
          password: hashedPassword,
          role: 'receptionist',
        },
      });
      
      console.log('✅ Usuário recepcionista criado com sucesso');
    } else {
      console.log('👍 Usuário recepcionista já existe');
    }

  } catch (error) {
    console.error('Erro ao criar usuários:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 