describe('JWT Utilities', () => {
    beforeAll(() => {
        process.env.JWT_SECRET = 'testsecret';
    });

    it('should generate a valid JWT and verify it', async () => {
        const { generateToken, verifyToken } = await import('../../../utils/jwt.js');
        const user = { id: '123abc' };
        const token = generateToken(user, '10m');
        const decoded = verifyToken(token);
        expect(decoded.id).toBe(user.id);
    });

    it('should fail with invalid token', async () => {
        const { verifyToken } = await import('../../../utils/jwt.js');
        expect(() => verifyToken('fake.token.value')).toThrow();
    });
});