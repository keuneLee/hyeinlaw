const NOTION_API_KEY = 'ntn_ba8706881512XBRTevCq7o0PNqC6iQ2gKGMKkleN8OH69U';
const NOTION_DB_ID   = '3c3033e5a59780d9841bfd8a6f57fc75';

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
      const res = await fetch(`https://api.notion.com/v1/databases/${NOTION_DB_ID}/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${NOTION_API_KEY}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filter: { property: '공개여부', checkbox: { equals: true } },
          sorts: [{ property: '날짜', direction: 'descending' }],
          page_size: 100,
        }),
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
