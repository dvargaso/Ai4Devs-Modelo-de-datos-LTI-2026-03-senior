import { PrismaClient, ApplicationStatus } from '@prisma/client';

const prisma = new PrismaClient();

export class Application {
    id?: number;
    positionId: number;
    candidateId: number;
    applicationDate: Date;
    status: ApplicationStatus;
    notes?: string;

    constructor(data: any) {
        this.id = data.id;
        this.positionId = data.positionId;
        this.candidateId = data.candidateId;
        this.applicationDate = new Date(data.applicationDate);
        this.status = data.status;
        this.notes = data.notes;
    }

    async save(): Promise<Application> {
        if (this.id) {
            const result = await prisma.application.update({
                where: { id: this.id },
                data: {
                    positionId: this.positionId,
                    candidateId: this.candidateId,
                    applicationDate: this.applicationDate,
                    status: this.status,
                    notes: this.notes,
                },
            });
            return new Application(result);
        } else {
            const result = await prisma.application.create({
                data: {
                    positionId: this.positionId,
                    candidateId: this.candidateId,
                    applicationDate: this.applicationDate,
                    status: this.status,
                    notes: this.notes,
                },
            });
            return new Application(result);
        }
    }

    static async findOne(id: number): Promise<Application | null> {
        const data = await prisma.application.findUnique({ where: { id } });
        if (!data) return null;
        return new Application(data);
    }
}
