import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class Company {
    id?: number;
    name: string;
    description?: string;

    constructor(data: any) {
        this.id = data.id;
        this.name = data.name;
        this.description = data.description;
    }

    async save(): Promise<Company> {
        if (this.id) {
            const result = await prisma.company.update({
                where: { id: this.id },
                data: { name: this.name, description: this.description }
            });
            return new Company(result);
        } else {
            const result = await prisma.company.create({
                data: { name: this.name, description: this.description }
            });
            return new Company(result);
        }
    }

    static async findOne(id: number): Promise<Company | null> {
        const data = await prisma.company.findUnique({ where: { id } });
        if (!data) return null;
        return new Company(data);
    }
}
