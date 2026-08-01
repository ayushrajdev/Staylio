export default function generateIdempotencyKey(): string {
    return crypto.randomUUID();
}
