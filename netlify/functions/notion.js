const NOTION_API_KEY = 'ntn_ba8706881512XBRTevCq7o0PNqC6iQ2gKGMKkleN8OH69U';
const NOTION_DB_ID   = '3c3033e5a59780e2bbd2e802f3419ced';

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const path = event.queryStringParameters?.path || 'db';
  const pageId = event.queryStringParameters?.pageId;

  try {
    if (path === 'blocks' && pageId) {
      const res = await fetch(`https://api.notion.com/v1/blocks/${pageId}/children?page_size=100`, {
        headers: {
          'Authorization': `Bearer ${NOTION_API_KEY}`,
          'Notion-Version': '2022-06-28',
        },
      });
      const data = await res.json();
      return { statusCode: 200, headers, body: JSON.stringify(data) };

    } else {
      // filter 없이 전체 조회해서 데이터 구조 파악
      const res = await fetch(`https://api.notion.com/v1/databases/${NOTION_DB_ID}/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${NOTION_API_KEY}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ page_size: 10 }),
      });
      const data = await res.json();
      return { statusCode: 200, headers, body: JSON.stringify(data) };
    }

  } catch (e) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: e.message }),
    };
  }
};
