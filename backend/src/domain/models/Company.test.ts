import { Company } from './Company';
import { PrismaClient } from '@prisma/client';

jest.mock('@prisma/client', () => {
    const mPrismaClient = {
        company: {
            create: jest.fn(),
            update: jest.fn(),
            findUnique: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mPrismaClient) };
});

const prisma = new PrismaClient();

describe('Company Model', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Constructor', () => {
        it('should initialize properties correctly', () => {
            const data = { id: 1, name: 'Acme Corp', description: 'A great company' };
            const company = new Company(data);
            expect(company).toMatchObject({ id: 1, name: 'Acme Corp', description: 'A great company' });
        });

        it('should handle missing optional description', () => {
            const company = new Company({ name: 'Acme Corp' });
            expect(company.description).toBeUndefined();
        });
    });

    describe('save', () => {
        it('should call prisma.company.create when no id is set', async () => {
            const data = { name: 'Acme Corp', description: 'A great company' };
            const company = new Company(data);
            const created = { id: 1, ...data };
            (prisma.company.create as jest.Mock).mockResolvedValue(created);

            const result = await company.save();
            expect(prisma.company.create).toHaveBeenCalledWith({
                data: { name: data.name, description: data.description },
            });
            expect(result).toMatchObject(created);
        });

        it('should call prisma.company.update when id is set', async () => {
            const data = { id: 1, name: 'Acme Corp', description: 'Updated description' };
            const company = new Company(data);
            (prisma.company.update as jest.Mock).mockResolvedValue(data);

            const result = await company.save();
            expect(prisma.company.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { name: data.name, description: data.description },
            });
            expect(result).toMatchObject(data);
        });
    });

    describe('findOne', () => {
        it('should return a Company instance when found', async () => {
            const data = { id: 1, name: 'Acme Corp', description: null };
            (prisma.company.findUnique as jest.Mock).mockResolvedValue(data);

            const result = await Company.findOne(1);
            expect(prisma.company.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(result).toBeInstanceOf(Company);
            expect(result?.name).toBe('Acme Corp');
        });

        it('should return null when not found', async () => {
            (prisma.company.findUnique as jest.Mock).mockResolvedValue(null);
            const result = await Company.findOne(99);
            expect(result).toBeNull();
        });
    });
});
