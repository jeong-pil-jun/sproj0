export async function onRequestPost(context) {
  const { request, env } = context;

  // 1. Check API Key
  if (!env.OPENAI_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'OpenAI API key (OPENAI_API_KEY) is not set in Cloudflare Variables.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    // 2. Parse form data
    const formData = await request.formData();
    const height = formData.get('height');
    const weight = formData.get('weight');
    const gender = formData.get('gender');
    const photoFile = formData.get('photo'); // File object

    if (!photoFile) {
      return new Response(
        JSON.stringify({ error: '사진 파일을 업로드해주세요.' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 3. Convert image File to base64
    const arrayBuffer = await photoFile.arrayBuffer();
    const base64Image = arrayBufferToBase64(arrayBuffer);
    const mimeType = photoFile.type || 'image/jpeg';

    // 4. Send request to OpenAI API
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `당신은 세계적인 전문 패션 스타일리스트이자 이미지 컨설턴트입니다.
사용자가 제공한 사진, 성별, 키, 몸무게를 면밀히 분석하여, 이들에게 최상의 비주얼 가치를 선사하는 스타일 컨설팅 보고서를 작성해 주십시오.

다음 JSON 형식을 엄격히 지켜 한국어로 자세하게 응답하십시오:
{
  "bodyType": "모래시계형 / 삼각형 / 직사각형 / 원형 / 역삼각형 등 분석된 체형 타입명",
  "bodyAnalysis": "체형에 대한 전반적인 분석 및 특징 설명 (어깨 너비, 허리 라인, 하체 비율 등 특징 분석)",
  "recommendedStyles": [
    { "title": "추천 스타일 룩 1", "description": "예: 미니멀 캐주얼. 체형 보완을 위해 어떤 상/하의 조합을 매치해야 하는지 설명" },
    { "title": "추천 스타일 룩 2", "description": "예: 세미 포멀 비즈니스. 핏감과 실루엣을 어떻게 연출해야 매력적인지 설명" }
  ],
  "avoidStyles": [
    { "title": "비추천 아이템/실루엣 1", "description": "피해야 할 구체적인 이유 설명" },
    { "title": "비추천 아이템/실루엣 2", "description": "피해야 할 구체적인 이유 설명" }
  ],
  "colorRecommendations": "어울리는 대표 색상군 및 퍼스널 컬러 제안",
  "tip": "추가 액세서리, 신발 매칭 팁 및 종합적인 패션 조언"
}`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `제 신체 정보는 다음과 같습니다:
- 성별: ${gender === 'male' ? '남성' : '여성'}
- 키: ${height}cm
- 몸무게: ${weight}kg

첨부한 제 전신 사진을 자세히 분석하여 스타일 컨설팅 보고서를 작성해주세요.`
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:${mimeType};base64,${base64Image}`
                }
              }
            ]
          }
        ],
        response_format: { type: 'json_object' }
      })
    });

    if (!openAIResponse.ok) {
      const errText = await openAIResponse.text();
      return new Response(
        JSON.stringify({ error: 'OpenAI API 호출에 실패했습니다.', details: errText }),
        {
          status: openAIResponse.status,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const openAIData = await openAIResponse.json();
    const resultText = openAIData.choices[0].message.content;

    return new Response(resultText, {
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });

  } catch (error) {
    return new Response(
      JSON.stringify({ error: '서버 에러가 발생했습니다.', details: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

// Safe ArrayBuffer to Base64 conversion
function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunk = 8192;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}
