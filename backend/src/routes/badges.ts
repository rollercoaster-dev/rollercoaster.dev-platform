import { Hono } from 'hono'
import { BadgeStatus } from '../../../shared/types/badge'
import { v4 as uuidv4 } from 'uuid'

// In-memory badge storage for development (replace with DB in production)
let badges = [
  {
    id: '1',
    name: 'JavaScript Mastery',
    description: 'Become proficient in JavaScript',
    content: '# JavaScript Mastery Badge\n\nThis badge represents proficiency in JavaScript programming.\n\n## Requirements\n\n- Complete 3 JavaScript projects\n- Learn ES6+ features\n- Understand async programming',
    progress: 65,
    status: BadgeStatus.IN_PROGRESS,
    requirements: [
      { id: '1-1', description: 'Complete 3 JavaScript projects', completed: true },
      { id: '1-2', description: 'Learn ES6+ features', completed: true },
      { id: '1-3', description: 'Understand async programming', completed: false }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    startDate: '2023-01-15',
    targetDate: '2023-03-30',
  },
  {
    id: '2',
    name: 'CSS Animations',
    description: 'Master CSS animations',
    content: '# CSS Animations Badge\n\nThis badge represents skill in creating CSS animations.\n\n## Requirements\n\n- Create 5 different animation types\n- Learn keyframes\n- Build a portfolio with animations',
    progress: 30,
    status: BadgeStatus.IN_PROGRESS,
    requirements: [
      { id: '2-1', description: 'Create 5 different animation types', completed: false },
      { id: '2-2', description: 'Learn keyframes', completed: true },
      { id: '2-3', description: 'Build a portfolio with animations', completed: false }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    startDate: '2023-02-01',
    targetDate: '2023-04-15',
  }
]

const badgesRoute = new Hono()

// Get all badges
badgesRoute.get('/', (c) => {
  return c.json(badges)
})

// Get single badge by ID
badgesRoute.get('/:id', (c) => {
  const id = c.req.param('id')
  const badge = badges.find(b => b.id === id)
  
  if (!badge) {
    return c.json({ error: 'Badge not found' }, 404)
  }
  
  return c.json(badge)
})

// Create new badge
badgesRoute.post('/', async (c) => {
  try {
    const body = await c.req.json()
    
    const newBadge = {
      id: uuidv4(),
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    badges.push(newBadge)
    return c.json(newBadge, 201)
  } catch (error) {
    return c.json({ error: 'Invalid request body' }, 400)
  }
})

// Update badge
badgesRoute.put('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const body = await c.req.json()
    
    const index = badges.findIndex(b => b.id === id)
    
    if (index === -1) {
      return c.json({ error: 'Badge not found' }, 404)
    }
    
    badges[index] = {
      ...badges[index],
      ...body,
      updatedAt: new Date().toISOString()
    }
    
    return c.json(badges[index])
  } catch (error) {
    return c.json({ error: 'Invalid request body' }, 400)
  }
})

// Update badge progress
badgesRoute.patch('/:id/progress', async (c) => {
  try {
    const id = c.req.param('id')
    const body = await c.req.json()
    
    const index = badges.findIndex(b => b.id === id)
    
    if (index === -1) {
      return c.json({ error: 'Badge not found' }, 404)
    }
    
    // Update progress
    badges[index].progress = body.progress
    badges[index].updatedAt = new Date().toISOString()
    
    // Update requirements if provided
    if (body.requirements && Array.isArray(body.requirements)) {
      body.requirements.forEach(req => {
        const reqIndex = badges[index].requirements.findIndex(r => r.id === req.id)
        if (reqIndex !== -1) {
          badges[index].requirements[reqIndex].completed = req.completed
        }
      })
    }
    
    // Update status based on progress
    if (badges[index].progress >= 100) {
      badges[index].status = BadgeStatus.COMPLETED
    } else if (badges[index].progress > 0) {
      badges[index].status = BadgeStatus.IN_PROGRESS
    } else {
      badges[index].status = BadgeStatus.NOT_STARTED
    }
    
    return c.json(badges[index])
  } catch (error) {
    return c.json({ error: 'Invalid request body' }, 400)
  }
})

// Delete badge
badgesRoute.delete('/:id', (c) => {
  const id = c.req.param('id')
  const initialLength = badges.length
  
  badges = badges.filter(b => b.id !== id)
  
  if (badges.length === initialLength) {
    return c.json({ error: 'Badge not found' }, 404)
  }
  
  return c.json({ success: true })
})

export default badgesRoute 