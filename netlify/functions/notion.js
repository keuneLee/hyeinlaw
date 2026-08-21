const NOTION_API_KEY = 'ntn_ba8706881512XBRTevCq7o0PNqC6iQ2gKGMKkleN8OH69U';
const NOTION_DB_ID   = '38e033e5a597809d9b3dfe23f8cd8296';

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // preflight 요청 처리
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const path = event.queryStringParameters?.path || 'db';
  const pageId = event.queryStringParameters?.pageId;

  try {
    let url, body;

    if (path === 'blocks' && pageId) {
      // 상세페이지 이미지 블록 조회
      url = `https://api.notion.com/v1/blocks/${pageId}/children?page_size=100`;
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${NOTION_API_KEY}`,
          'Notion-Version': '2022-06-28',
        },
      });
      const data = await res.json();
      return { statusCode: 200, headers, body: JSON.stringify(data) };

    } else {
      // 승소사례 목록 조회
      url = `https://api.notion.com/v1/databases/${NOTION_DB_ID}/query`;
      const res = await fetch(url, {
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
