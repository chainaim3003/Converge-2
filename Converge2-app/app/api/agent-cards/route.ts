import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

/**
 * API Route: GET /api/agent-cards
 * 
 * Lists all available agent cards from the local filesystem.
 * Reads from: ../Legent/A2A/agent-cards/
 */

// Path to agent cards directory (relative to project root)
const AGENT_CARDS_DIR = path.join(process.cwd(), '..', 'Legent', 'A2A', 'agent-cards')

export async function GET(request: NextRequest) {
  console.log(`[API] Listing agent cards from: ${AGENT_CARDS_DIR}`)
  
  try {
    // Check if directory exists
    if (!fs.existsSync(AGENT_CARDS_DIR)) {
      return NextResponse.json(
        {
          error: 'Agent cards directory not found',
          expectedPath: AGENT_CARDS_DIR,
          hint: 'Run generateAgentCards.sh to create agent cards'
        },
        { status: 404 }
      )
    }
    
    // List all card files
    const files = fs.readdirSync(AGENT_CARDS_DIR)
      .filter(f => f.endsWith('-card.json'))
    
    // Build response with card summaries
    const cards = files.map(filename => {
      const alias = filename.replace('-card.json', '')
      const cardPath = path.join(AGENT_CARDS_DIR, filename)
      
      try {
        const cardData = JSON.parse(fs.readFileSync(cardPath, 'utf8'))
        return {
          alias,
          filename,
          name: cardData.name,
          url: `/api/agent-cards/${alias}`,
          vLEImetadata: cardData.extensions?.vLEImetadata ? {
            agentName: cardData.extensions.vLEImetadata.agentName,
            oorHolderName: cardData.extensions.vLEImetadata.oorHolderName
          } : null
        }
      } catch {
        return {
          alias,
          filename,
          name: 'Error reading card',
          url: `/api/agent-cards/${alias}`,
          vLEImetadata: null
        }
      }
    })
    
    console.log(`[API] Found ${cards.length} agent cards`)
    
    return NextResponse.json({
      count: cards.length,
      directory: AGENT_CARDS_DIR,
      cards
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      }
    })
    
  } catch (error: any) {
    console.error(`[API] Error listing agent cards:`, error)
    
    return NextResponse.json(
      {
        error: 'Failed to list agent cards',
        details: error.message
      },
      { status: 500 }
    )
  }
}
