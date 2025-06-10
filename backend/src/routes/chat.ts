// filepath: backend/src/routes/chat.ts
import { Router } from 'express';
import ChatController from '../controllers/ChatController';
import authenticateToken from '../middleware/auth';
import rateLimiter from '../middleware/rateLimiting';

const router = Router();

// Apply authentication and rate limiting to all routes
router.use(authenticateToken.authenticate);
router.use(rateLimiter.apiLimiter);

// Chat Room routes
router.get('/rooms', ChatController.getAllChatRooms);
router.get('/rooms/:id', ChatController.getChatRoomById);
router.post('/rooms', ChatController.createChatRoom);
router.put('/rooms/:id', ChatController.updateChatRoom);
router.delete('/rooms/:id', ChatController.deleteChatRoom);
router.post('/rooms/:roomId/participants', ChatController.addParticipant);
router.delete('/rooms/:roomId/participants', ChatController.removeParticipant);
router.post('/direct-message', ChatController.createDirectMessage);

// Message routes
router.get('/rooms/:roomId/messages', ChatController.getMessagesByRoom);
router.post('/messages', ChatController.createMessage);
router.put('/messages/:id', ChatController.updateMessage);
router.delete('/messages/:id', ChatController.deleteMessage);
router.post('/messages/:messageId/reactions', ChatController.addReaction);
router.delete('/messages/:messageId/reactions', ChatController.removeReaction);
router.get('/messages/search', ChatController.searchMessages);

// Analytics routes
router.get('/stats', ChatController.getChatStats);
router.get('/rooms/:roomId/activity', ChatController.getRoomActivity);
router.get('/users/:userId/activity', ChatController.getUserActivity);
router.get('/activity/my', ChatController.getMyActivity);

export default router;
