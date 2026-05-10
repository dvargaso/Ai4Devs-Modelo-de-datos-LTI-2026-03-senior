import { Application } from './Application';
import { PrismaClient, ApplicationStatus } from '@prisma/client';

jest.mock('@prisma/client', () => {
    const mPrismaClient = {
        application: {
            create: jest.fn(),
            update: jest.fn(),
            findUnique: jest.fn(),
        },
    };
    return {
        PrismaClient: jest.fn(() => mPrismaClient),
        ApplicationStatus: {
            Pending: 'Pending',
            Reviewing: 'Reviewing',
            Interview: 'Interview',
            Offered: 'Offered',
            Rejected: 'Rejected',
        },
    };
});

const prisma = new PrismaClient();

describe('Application Model', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Constructor', () => {
        it('should initialize properties correctly', () => {
            const data = {
                id: 1,
                positionId: 10,
                candidateId: 5,
                applicationDate: '2026-01-15',
                status: ApplicationStatus.Pending,
                notes: 'Strong candidate',
            };
            const app = new Application(data);
            expect(app.id).toBe(1);
            expect(app.positionId).toBe(10);
            expect(app.candidateId).toBe(5);
            expect(app.applicationDate).toEqual(new Date('2026-01-15'));
            expect(app.status).toBe(ApplicationStatus.Pending);
            expect(app.notes).toBe('Strong candidate');
        });
    });

    describe('save', () => {
        it('should call prisma.application.create when no id is set', async () => {
            const data = {
                positionId: 10,
                candidateId: 5,
                applicationDate: '2026-01-15',
                status: ApplicationStatus.Pending,
            };
            const app = new Application(data);
            const created = { id: 1, ...data, applicationDate: new Date(data.applicationDate) };
            (prisma.application.create as jest.Mock).mockResolvedValue(created);

            const result = await app.save();
            expect(prisma.application.create).toHaveBeenCalledWith({
                data: {
                    positionId: data.positionId,
                    candidateId: data.candidateId,
                    applicationDate: new Date(data.applicationDate),
                    status: data.status,
                    notes: undefined,
                },
            });
            expect(result).toMatchObject({ positionId: 10, candidateId: 5 });
        });

        it('should surface P2002 when (candidateId, positionId) is duplicated', async () => {
            const data = {
                positionId: 10,
                candidateId: 5,
                applicationDate: '2026-01-15',
                status: ApplicationStatus.Pending,
            };
            const app = new Application(data);
            (prisma.application.create as jest.Mock).mockRejectedValue({ code: 'P2002' });

            await expect(app.save()).rejects.toMatchObject({ code: 'P2002' });
        });
    });
});
