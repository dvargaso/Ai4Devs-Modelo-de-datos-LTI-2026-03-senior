import { InterviewStep } from './InterviewStep';
import { PrismaClient } from '@prisma/client';

jest.mock('@prisma/client', () => {
    const mPrismaClient = {
        interviewStep: {
            create: jest.fn(),
            update: jest.fn(),
            findUnique: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mPrismaClient) };
});

const prisma = new PrismaClient();

describe('InterviewStep Model', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Constructor', () => {
        it('should initialize properties correctly', () => {
            const data = { id: 1, interviewFlowId: 2, interviewTypeId: 3, name: 'Technical', orderIndex: 1 };
            const step = new InterviewStep(data);
            expect(step).toMatchObject(data);
        });
    });

    describe('save', () => {
        it('should call prisma.interviewStep.create when no id is set', async () => {
            const data = { interviewFlowId: 1, interviewTypeId: 2, name: 'Technical', orderIndex: 1 };
            const step = new InterviewStep(data);
            const created = { id: 1, ...data };
            (prisma.interviewStep.create as jest.Mock).mockResolvedValue(created);

            const result = await step.save();
            expect(prisma.interviewStep.create).toHaveBeenCalledWith({
                data: {
                    interviewFlowId: data.interviewFlowId,
                    interviewTypeId: data.interviewTypeId,
                    name: data.name,
                    orderIndex: data.orderIndex,
                },
            });
            expect(result).toMatchObject(created);
        });

        it('should surface P2002 when (interviewFlowId, orderIndex) is duplicated', async () => {
            const data = { interviewFlowId: 1, interviewTypeId: 2, name: 'Duplicate Step', orderIndex: 1 };
            const step = new InterviewStep(data);
            (prisma.interviewStep.create as jest.Mock).mockRejectedValue({ code: 'P2002' });

            await expect(step.save()).rejects.toMatchObject({ code: 'P2002' });
        });
    });
});
