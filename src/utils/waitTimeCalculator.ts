// Calculate estimated wait time based on queue position
export const calculateWaitTime = (queuePosition: number): number => {
    // Assume each customer takes ~3 minutes
    return Math.max(0, (queuePosition - 1) * 3);
};

// Get queue position for a specific user
export const getQueuePosition = (queues: any[], userId: string): number => {
    const userQueue = queues.find(q => q.userId === userId);
    if (!userQueue) return 0;

    // Count how many people are ahead in the queue
    const queuesBefore = queues.filter(q =>
        q.status === "WAITING" &&
        parseInt(q.queueNumber) < parseInt(userQueue.queueNumber)
    );

    return queuesBefore.length + 1;
};
