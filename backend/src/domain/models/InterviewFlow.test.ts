import { InterviewFlow } from './InterviewFlow';
import { PrismaClient } from '@prisma/client';

jest.mock('@prisma/client', () => {
    const mPrismaClient = {
        interviewFlow: {
            create: jest.fn(),
            update: jest.fn(),
            findUnique: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mPrismaClient) };
});

const prisma = new PrismaClient();

describe('InterviewFlow Model', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Constructor', () => {
        it('should initialize name and description correctly', () => {
            const flow = new InterviewFlow({ id: 1, name: 'Engineering Hiring', description: 'Standard tech flow' });
            expect(flow.id).toBe(1);
            expect(flow.name).toBe('Engineering Hiring');
            expect(flow.description).toBe('Standard tech flow');
        });

        it('should allow optional description', () => {
            const flow = new InterviewFlow({ name: 'Quick Screening' });
            expect(flow.name).toBe('Quick Screening');
            expect(flow.description).toBeUndefined();
        });
    });

    describe('save', () => {
        it('should call prisma.interviewFlow.create with name and description when no id', async () => {
            const data = { name: 'Engineering Hiring', description: 'Standard tech flow' };
            const flow = new InterviewFlow(data);
            const created = { id: 1, ...data };
            (prisma.interviewFlow.create as jest.Mock).mockResolvedValue(created);

            const result = await flow.save();
            expect(prisma.interviewFlow.create).toHaveBeenCalledWith({
                data: { name: data.name, description: data.description },
            });
            expect(result).toMatchObject(created);
        });

        it('should call prisma.interviewFlow.update when id is set', async () => {
            const data = { id: 1, name: 'Updated Flow', description: undefined };
            const flow = new InterviewFlow(data);
            (prisma.interviewFlow.update as jest.Mock).mockResolvedValue(data);

            await flow.save();
            expect(prisma.interviewFlow.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { name: 'Updated Flow', description: undefined },
            });
        });
    });
});
