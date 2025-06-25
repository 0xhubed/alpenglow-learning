import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all users for leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        profile: true,
      },
      orderBy: {
        profile: {
          totalPoints: 'desc'
        }
      },
      take: 50 // Limit to top 50 users
    });

    const leaderboard = users
      .filter(user => user.profile)
      .map(user => ({
        id: user.id,
        username: user.username,
        avatar: user.profile!.avatar,
        totalPoints: user.profile!.totalPoints,
        gamesCompleted: user.profile!.gamesCompleted,
        lastPlayed: user.updatedAt,
      }));

    res.json({
      success: true,
      data: leaderboard
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch leaderboard'
    });
  }
});

// Create or get user
router.post('/', async (req, res) => {
  try {
    const { username, avatar } = req.body;

    if (!username || !avatar) {
      return res.status(400).json({
        success: false,
        error: 'Username and avatar are required'
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { username },
      include: { profile: true }
    });

    if (existingUser) {
      return res.json({
        success: true,
        data: {
          id: existingUser.id,
          username: existingUser.username,
          avatar: existingUser.profile?.avatar || avatar,
          totalPoints: existingUser.profile?.totalPoints || 0,
          currentLevel: existingUser.profile?.currentLevel || 1,
          gamesCompleted: existingUser.profile?.gamesCompleted || 0,
          achievements: []
        }
      });
    }

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        username,
        email: `${username}@temp.local`, // Temporary email for child users
        password: 'temp', // No real password needed for child users
        profile: {
          create: {
            avatar,
            totalPoints: 0,
            currentLevel: 1,
            gamesCompleted: 0
          }
        }
      },
      include: {
        profile: true
      }
    });

    res.status(201).json({
      success: true,
      data: {
        id: newUser.id,
        username: newUser.username,
        avatar: newUser.profile?.avatar || avatar,
        totalPoints: newUser.profile?.totalPoints || 0,
        currentLevel: newUser.profile?.currentLevel || 1,
        gamesCompleted: newUser.profile?.gamesCompleted || 0,
        achievements: []
      }
    });
  } catch (error) {
    console.error('Error creating/getting user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create or get user'
    });
  }
});

// Update user points
router.patch('/:userId/points', async (req, res) => {
  try {
    const { userId } = req.params;
    const { points } = req.body;

    if (typeof points !== 'number') {
      return res.status(400).json({
        success: false,
        error: 'Points must be a number'
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true }
    });

    if (!user || !user.profile) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const updatedProfile = await prisma.profile.update({
      where: { userId },
      data: {
        totalPoints: {
          increment: points
        }
      }
    });

    res.json({
      success: true,
      data: {
        totalPoints: updatedProfile.totalPoints
      }
    });
  } catch (error) {
    console.error('Error updating user points:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update user points'
    });
  }
});

// Complete game
router.patch('/:userId/complete-game', async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true }
    });

    if (!user || !user.profile) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const updatedProfile = await prisma.profile.update({
      where: { userId },
      data: {
        gamesCompleted: {
          increment: 1
        }
      }
    });

    res.json({
      success: true,
      data: {
        gamesCompleted: updatedProfile.gamesCompleted
      }
    });
  } catch (error) {
    console.error('Error completing game:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to complete game'
    });
  }
});

export default router;