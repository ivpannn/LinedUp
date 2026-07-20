// Calculate estimated wait time based on queue position
export const calculateWaitTime = (queuePosition: number): number => {
    // Assume each customer takes ~3 minutes
    return Math.max(0, (queuePosition - 1) * 10); // .max(0), prevent negative wait times (0 * 3 = 0)
};

// Get queue position for a specific user
export const getQueuePosition = (queues: any[], userId: string): number => {
    const userQueue = queues.find(q => q.userId === userId); //returns the first item that the condition is true
    if (!userQueue) return 0;

    // Count how many people are ahead in the queue
    const queuesBefore = queues.filter(q =>
        q.status === "WAITING" && //SERVING status will not count 
        parseInt(q.queueNumber) < parseInt(userQueue.queueNumber) //convert string into integer
    );

    return queuesBefore.length + 1; // (indexing start from 0 [total count start from 1]) +1 because is the lastest position .length is start from 0 
};
