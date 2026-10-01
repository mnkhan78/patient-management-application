const { getLiveQueue } = require('../../services/public/queue.service');

const getPublicQueue = async (req, res) => {
    try {
        const queueData = await getLiveQueue();

        res.status(200).json({
            success: true,
            data: queueData,
        });

    } catch (error) {
        console.error('Public queue error:', error);

        res.status(500).json({
            success: false,
            message: 'Unable to load clinic queue',
        });
    }
};

module.exports = {
    getPublicQueue,
};