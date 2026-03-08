import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

/**
 * API Route: GET /api/agent-cards/[agentAlias]
 * 
 * Serves agent cards from the local filesystem.
 * Reads from: ../Legent/A2A/agent-cards/{agentAlias}-card.json
 * 
 * Usage:
 *   GET /api/agent-cards/jupiterSellerAgent
 *   GET /api/agent-cards/tommyBuyerAgent
 */

// Path to agent cards directory (relative to project root)
const AGENT_CARDS_DIR = path.join(process.cwd(), '..', 'Legent', 'A2A', 'agent-cards')

export async function GET(
  request: NextRequest,
  { params }: { params: { agentAlias: string } }
) {
  const { agentAlias } = params
  
  console.log(`[API] Agent card request: ${agentAlias}`)
  console.log(`[API] Looking in: ${AGENT_CARDS_DIR}`)
  
  try {
    // Remove .json extension if provided
    const cleanAlias = agentAlias.replace(/\.json$/, '')
    const cardPath = path.join(AGENT_CARDS_DIR, `${cleanAlias}-card.json`)
    
    console.log(`[API] Card path: ${cardPath}`)
    
    // Check if file exists
    if (!fs.existsSync(cardPath)) {
      // List available cards for helpful error message
      let availableCards: string[] = []
      if (fs.existsSync(AGENT_CARDS_DIR)) {
        availableCards = fs.readdirSync(AGENT_CARDS_DIR)
          .filter(f => f.endsWith('-card.json'))
          .map(f => f.replace('-card.json', ''))
      }
      
      console.log(`[API] Card not found: ${cleanAlias}`)
      console.log(`[API] Available cards: ${availableCards.join(', ')}`)
      
      return NextResponse.json(
        {
          error: `Agent card not found: ${cleanAlias}`,
          availableCards,
          hint: `Try: /api/agent-cards/${availableCards[0] || 'jupiterSellerAgent'}`
        },
        { status: 404 }
      )
    }
    
    // Read and parse the card
    const cardData = JSON.parse(fs.readFileSync(cardPath, 'utf8'))
    
    console.log(`[API] Successfully serving card: ${cleanAlias}`)
    console.log(`[API] Card name: ${cardData.name}`)
    
    // Return with CORS headers for cross-origin requests
    return NextResponse.json(cardData, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      }
    })
    
  } catch (error: any) {
    console.error(`[API] Error reading agent card:`, error)
    
    return NextResponse.json(
      {
        error: 'Failed to read agent card',
        details: error.message
      },
      { status: 500 }
    )
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS(request: NextRequest) {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  })
}
