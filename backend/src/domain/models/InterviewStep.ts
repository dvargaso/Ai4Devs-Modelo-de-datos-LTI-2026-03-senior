import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class InterviewStep {
    id?: number;
    interviewFlowId: number;
    interviewTypeId: number;
    name: string;
    orderIndex: number;

    constructor(data: any) {
        this.id = data.id;
        this.interviewFlowId = data.interviewFlowId;
        this.interviewTypeId = data.interviewTypeId;
        this.name = data.name;
        this.orderIndex = data.orderIndex;
    }

    async save(): Promise<InterviewStep> {
        if (this.id) {
            const result = await prisma.interviewStep.update({
                where: { id: this.id },
                data: {
                    interviewFlowId: this.interviewFlowId,
                    interviewTypeId: this.interviewTypeId,
                    name: this.name,
                    orderIndex: this.orderIndex,
                },
            });
            return new InterviewStep(result);
        } else {
            const result = await prisma.interviewStep.create({
                data: {
                    interviewFlowId: this.interviewFlowId,
                    interviewTypeId: this.interviewTypeId,
                    name: this.name,
                    orderIndex: this.orderIndex,
                },
            });
            return new InterviewStep(result);
        }
    }

    static async findOne(id: number): Promise<InterviewStep | null> {
        const data = await prisma.interviewStep.findUnique({ where: { id } });
        if (!data) return null;
        return new InterviewStep(data);
    }
}
