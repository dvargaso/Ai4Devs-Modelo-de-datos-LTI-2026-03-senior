import {
    validateName,
    validateEmail,
    validatePhone,
    validateDate,
    validateAddress,
    validateEducation,
    validateExperience,
    validateCV,
    validateCandidateData,
    validatePositionStatus,
    validateEmploymentType,
    validateApplicationStatus,
    validateInterviewResult,
    validateScore,
} from '../validator';

describe('Validator Tests', () => {
    describe('validateName', () => {
        it('should validate a correct name', () => {
            expect(() => validateName('John Doe')).not.toThrow();
        });

        it('should throw an error for an invalid name', () => {
            expect(() => validateName('')).toThrow('Invalid name');
            expect(() => validateName('J')).toThrow('Invalid name');
            expect(() => validateName('A'.repeat(101))).toThrow('Invalid name');
            expect(() => validateName('John123')).toThrow('Invalid name');
        });
    });

    describe('validateEmail', () => {
        it('should validate a correct email', () => {
            expect(() => validateEmail('john.doe@example.com')).not.toThrow();
        });

        it('should throw an error for an invalid email', () => {
            expect(() => validateEmail('')).toThrow('Invalid email');
            expect(() => validateEmail('john.doe')).toThrow('Invalid email');
            expect(() => validateEmail('john.doe@com')).toThrow('Invalid email');
        });
    });

    describe('validatePhone', () => {
        it('should validate a correct phone number', () => {
            expect(() => validatePhone('612345678')).not.toThrow();
        });

        it('should throw an error for an invalid phone number', () => {
            expect(() => validatePhone('')).not.toThrow(); // Optional field
            expect(() => validatePhone('512345678')).toThrow('Invalid phone');
            expect(() => validatePhone('61234567')).toThrow('Invalid phone');
            expect(() => validatePhone('6123456789')).toThrow('Invalid phone');
        });
    });

    describe('validateDate', () => {
        it('should validate a correct date', () => {
            expect(() => validateDate('2023-01-01')).not.toThrow();
        });

        it('should throw an error for an invalid date', () => {
            expect(() => validateDate('')).toThrow('Invalid date');
            expect(() => validateDate('01-01-2023')).toThrow('Invalid date');
            expect(() => validateDate('2023/01/01')).toThrow('Invalid date');
        });
    });

    describe('validateAddress', () => {
        it('should validate a correct address', () => {
            expect(() => validateAddress('123 Main St')).not.toThrow();
        });

        it('should throw an error for an invalid address', () => {
            expect(() => validateAddress('A'.repeat(101))).toThrow('Invalid address');
        });
    });

    describe('validateEducation', () => {
        it('should validate correct education data', () => {
            const education = {
                institution: 'University',
                title: 'BSc',
                startDate: '2020-01-01',
                endDate: '2023-01-01'
            };
            expect(() => validateEducation(education)).not.toThrow();
        });

        it('should throw an error for invalid education data', () => {
            const invalidEducation = {
                institution: '',
                title: 'BSc',
                startDate: '2020-01-01',
                endDate: '2023-01-01'
            };
            expect(() => validateEducation(invalidEducation)).toThrow('Invalid institution');

            const invalidEducation2 = {
                institution: 'University',
                title: '',
                startDate: '2020-01-01',
                endDate: '2023-01-01'
            };
            expect(() => validateEducation(invalidEducation2)).toThrow('Invalid title');

            const invalidEducation3 = {
                institution: 'University',
                title: 'BSc',
                startDate: '2020-01-01',
                endDate: '2023/01/01'
            };
            expect(() => validateEducation(invalidEducation3)).toThrow('Invalid end date');
        });
    });

    describe('validateExperience', () => {
        it('should validate correct experience data', () => {
            const experience = {
                company: 'Company',
                position: 'Developer',
                startDate: '2020-01-01',
                endDate: '2023-01-01'
            };
            expect(() => validateExperience(experience)).not.toThrow();
        });

        it('should throw an error for invalid experience data', () => {
            const invalidExperience = {
                company: '',
                position: 'Developer',
                startDate: '2020-01-01',
                endDate: '2023-01-01'
            };
            expect(() => validateExperience(invalidExperience)).toThrow('Invalid company');

            const invalidExperience2 = {
                company: 'Company',
                position: '',
                startDate: '2020-01-01',
                endDate: '2023-01-01'
            };
            expect(() => validateExperience(invalidExperience2)).toThrow('Invalid position');

            const invalidExperience3 = {
                company: 'Company',
                position: 'Developer',
                startDate: '2020-01-01',
                endDate: '2023/01/01'
            };
            expect(() => validateExperience(invalidExperience3)).toThrow('Invalid end date');
        });
    });

    describe('validateCV', () => {
        it('should validate correct CV data', () => {
            const cv = {
                filePath: '/path/to/cv.pdf',
                fileType: 'application/pdf'
            };
            expect(() => validateCV(cv)).not.toThrow();
        });

        it('should throw an error for invalid CV data', () => {
            const invalidCV = {
                filePath: '',
                fileType: 'application/pdf'
            };
            expect(() => validateCV(invalidCV)).toThrow('Invalid CV data');

            const invalidCV2 = {
                filePath: '/path/to/cv.pdf',
                fileType: ''
            };
            expect(() => validateCV(invalidCV2)).toThrow('Invalid CV data');
        });
    });

    describe('validatePositionStatus', () => {
        it('should accept valid status values', () => {
            expect(() => validatePositionStatus('Draft')).not.toThrow();
            expect(() => validatePositionStatus('Open')).not.toThrow();
            expect(() => validatePositionStatus('Closed')).not.toThrow();
            expect(() => validatePositionStatus('Archived')).not.toThrow();
        });

        it('should throw for invalid status values', () => {
            expect(() => validatePositionStatus('open')).toThrow('Invalid position status');
            expect(() => validatePositionStatus('OPEN')).toThrow('Invalid position status');
            expect(() => validatePositionStatus('')).toThrow('Invalid position status');
            expect(() => validatePositionStatus('Unknown')).toThrow('Invalid position status');
        });
    });

    describe('validateEmploymentType', () => {
        it('should accept valid employment type values', () => {
            expect(() => validateEmploymentType('Full_time')).not.toThrow();
            expect(() => validateEmploymentType('Part_time')).not.toThrow();
            expect(() => validateEmploymentType('Contract')).not.toThrow();
            expect(() => validateEmploymentType('Internship')).not.toThrow();
        });

        it('should throw for invalid employment type values', () => {
            expect(() => validateEmploymentType('full-time')).toThrow('Invalid employment type');
            expect(() => validateEmploymentType('FULL_TIME')).toThrow('Invalid employment type');
            expect(() => validateEmploymentType('')).toThrow('Invalid employment type');
        });
    });

    describe('validateApplicationStatus', () => {
        it('should accept valid application status values', () => {
            expect(() => validateApplicationStatus('Pending')).not.toThrow();
            expect(() => validateApplicationStatus('Reviewing')).not.toThrow();
            expect(() => validateApplicationStatus('Interview')).not.toThrow();
            expect(() => validateApplicationStatus('Offered')).not.toThrow();
            expect(() => validateApplicationStatus('Rejected')).not.toThrow();
        });

        it('should throw for invalid application status values', () => {
            expect(() => validateApplicationStatus('pending')).toThrow('Invalid application status');
            expect(() => validateApplicationStatus('REJECTED')).toThrow('Invalid application status');
            expect(() => validateApplicationStatus('')).toThrow('Invalid application status');
        });
    });

    describe('validateInterviewResult', () => {
        it('should accept valid interview result values', () => {
            expect(() => validateInterviewResult('Pass')).not.toThrow();
            expect(() => validateInterviewResult('Fail')).not.toThrow();
            expect(() => validateInterviewResult('No_show')).not.toThrow();
        });

        it('should throw for invalid interview result values', () => {
            expect(() => validateInterviewResult('pass')).toThrow('Invalid interview result');
            expect(() => validateInterviewResult('PASS')).toThrow('Invalid interview result');
            expect(() => validateInterviewResult('')).toThrow('Invalid interview result');
            expect(() => validateInterviewResult('no-show')).toThrow('Invalid interview result');
        });
    });

    describe('validateScore', () => {
        it('should accept boundary values 1 and 10', () => {
            expect(() => validateScore(1)).not.toThrow();
            expect(() => validateScore(10)).not.toThrow();
        });

        it('should accept null and undefined (optional field)', () => {
            expect(() => validateScore(null)).not.toThrow();
            expect(() => validateScore(undefined)).not.toThrow();
        });

        it('should throw for values outside [1, 10]', () => {
            expect(() => validateScore(0)).toThrow('Invalid score');
            expect(() => validateScore(11)).toThrow('Invalid score');
            expect(() => validateScore(-1)).toThrow('Invalid score');
        });

        it('should throw for non-integer values', () => {
            expect(() => validateScore(5.5)).toThrow('Invalid score');
        });
    });

    describe('validateCandidateData', () => {
        it('should validate correct candidate data', () => {
            const candidateData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                phone: '612345678',
                address: '123 Main St',
                educations: [{
                    institution: 'University',
                    title: 'BSc',
                    startDate: '2020-01-01',
                    endDate: '2023-01-01'
                }],
                workExperiences: [{
                    company: 'Company',
                    position: 'Developer',
                    startDate: '2020-01-01',
                    endDate: '2023-01-01'
                }],
                cv: {
                    filePath: '/path/to/cv.pdf',
                    fileType: 'application/pdf'
                }
            };
            expect(() => validateCandidateData(candidateData)).not.toThrow();
        });

        it('should throw an error for invalid candidate data', () => {
            const invalidCandidateData = {
                firstName: '',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                phone: '612345678',
                address: '123 Main St',
                educations: [{
                    institution: 'University',
                    title: 'BSc',
                    startDate: '2020-01-01',
                    endDate: '2023-01-01'
                }],
                workExperiences: [{
                    company: 'Company',
                    position: 'Developer',
                    startDate: '2020-01-01',
                    endDate: '2023-01-01'
                }],
                cv: {
                    filePath: '/path/to/cv.pdf',
                    fileType: 'application/pdf'
                }
            };
            expect(() => validateCandidateData(invalidCandidateData)).toThrow('Invalid name');
        });
    });
});