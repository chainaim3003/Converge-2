import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

/**
 * API Route: GET /api/agent-cards/[agentAlias]
 * Serves agent cards from the local filesystem.
 */
const AGENT_CARDS_DIR = path.join(process.cwd(), '..', 'Legent', 'A2A', 'agent-cards')

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ agentAlias: string }> }
) {
  const { agentAlias } = await params

  console.log(`[API] Agent card request: ${agentAlias}`)
  console.log(`[API] Looking in: ${AGENT_CARDS_DIR}`)

  try {
    const cleanAlias = agentAlias.replace(/\.json$/, '')
    const cardPath = path.join(AGENT_CARDS_DIR, `${cleanAlias}-card.json`)
    console.log(`[API] Card path: ${cardPath}`)

    if (!fs.existsSync(cardPath)) {
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

    const cardData = JSON.parse(fs.readFileSync(cardPath, 'utf8'))
    console.log(`[API] Successfully serving card: ${cleanAlias}`)
    console.log(`[API] Card name: ${cardData.name}`)

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
      { error: 'Failed to read agent card', details: error.message },
      { status: 500 }
    )
  }
}

export async function OPTIONS(request: NextRequest) {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  })
}
