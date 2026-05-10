import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class InterviewFlow {
    id?: number;
    name: string;
    description?: string;

    constructor(data: any) {
        this.id = data.id;
        this.name = data.name;
        this.description = data.description;
    }

    async save(): Promise<InterviewFlow> {
        if (this.id) {
            const result = await prisma.interviewFlow.update({
                where: { id: this.id },
                data: { name: this.name, description: this.description },
            });
            return new InterviewFlow(result);
        } else {
            const result = await prisma.interviewFlow.create({
                data: { name: this.name, description: this.description },
            });
            return new InterviewFlow(result);
        }
    }

    static async findOne(id: number): Promise<InterviewFlow | null> {
        const data = await prisma.interviewFlow.findUnique({ where: { id } });
        if (!data) return null;
        return new InterviewFlow(data);
    }
}
