import { AssessmentFormData, ScenarioType } from "../types";

// =================================================================================
// Configuration & Model Strategy
// =================================================================================
// 1. Compliance/Reasoning Tasks (Current): Use 'gpt-5.2-pro'
//    - Reasoning Effort: 'high' (required for GDPR analysis, TIA, DPIA).
//    - Capabilities: High context window, strong instruction following.
//
// 2. Coding Tasks (Future): Use 'gpt-5.2-codex'
//    - Use for generating specific technical implementations or fixes.
//
// 3. Simple/Cost-Sensitive Tasks (Future): Use 'gpt-5.2' or 'gpt-5-mini'
//    - Use for quick summaries or chat interactions not requiring deep analysis.
// =================================================================================

const MODEL_ID = "gpt-5.2-pro"; 

const SYSTEM_INSTRUCTION = `
你是 Chery Europe R&D 的 Data Protection & Privacy Program Lead（偏落地执行，不是学术解释）。
你的目标：针对用户输入的一个“场景”，一次性产出可交付材料包。

交付风格要求（企业可用）：
- 输出结构清晰、字段化、可复制粘贴、可直接发邮件/放PPT
- 避免空泛“建议加强”，必须给出动作清单、模板字段、证据清单、验收标准
- 不确定信息要列为 “Assumptions / Open Questions（<=8条）”，但仍先给默认可落地方案
- 对关键合规点标注来源名称（不长篇引用）：GDPR Article 30/28/35，EDPB transfer guidance，EU SCC等。
- **IMPORTANT**: 如果用户上传了法规文件，请在回答中显式引用这些文件（列出文件名、相关页码或条款）。

Step 3 输出“交付包”时必须包含以下固定章节，且章节之间必须使用 "---SECTION: [Section Name]---" 分隔，以便我进行程序解析。
章节顺序如下：
1. Executive Conclusion
2. Actions (MUST/SHOULD/NICE)
3. Regulation References Used (If files provided)
4. RoPA Entry
5. Assessment Decision
6. Vendor & DPA Gap List
7. Risk Register
8. Evidence Pack
9. Open Questions

请使用中文/EN输出报告内容（双语工作环境），保持专业性。
`;

// Helper to upload a single file to OpenAI
// Note: We use 'assistants' purpose which allows the file to be used in Responses API
// as either input_file (Plan A) or via vector stores (Plan B).
const uploadFile = async (file: File, apiKey: string): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("purpose", "assistants"); 

  const response = await fetch("https://api.openai.com/v1/files", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(`File upload failed: ${err.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return data.id;
};

export const generateComplianceReport = async (
  scenario: ScenarioType,
  data: AssessmentFormData,
  apiKey: string
): Promise<string> => {
  
  if (!apiKey) {
    throw new Error("OpenAI API Key is missing.");
  }

  // 1. Upload files if any exist
  const fileIds: string[] = [];
  if (data.files && data.files.length > 0) {
    try {
      const uploadPromises = data.files.map(f => uploadFile(f, apiKey));
      const ids = await Promise.all(uploadPromises);
      fileIds.push(...ids);
      console.log("Uploaded files:", fileIds);
    } catch (e: any) {
      console.error("Failed to upload files", e);
      throw new Error(`Failed to upload attached regulations to OpenAI: ${e.message}`);
    }
  }

  // 2. Construct the text prompt
  const userPromptText = `
  场景类型: ${scenario}

  场景描述数据:
  1) System/Process 名称: ${data.systemName}
  2) 数据主体: ${data.dataSubject}
  3) 数据类型: ${data.dataType}
  4) 处理目的: ${data.purpose}
  5) 数据来源: ${data.source}
  6) 存储位置: ${data.storage}
  7) 接收方/共享对象: ${data.recipients}
  8) 是否跨境: ${data.crossBorder}
  9) 保留期限: ${data.retention}
  10) 安全措施现状: ${data.security}

  请执行任务链 A/B/C/D/E 并输出最终交付包。如果附带了文件，请务必结合文件内容进行分析。
  `;

  // 3. Construct Input Content Parts (Plan A: Multimodal Context)
  // We attach text and files directly to the user message content.
  const contentParts: any[] = [
    { type: "input_text", text: userPromptText }
  ];

  fileIds.forEach(fid => {
    contentParts.push({
      type: "input_file",
      file_id: fid
    });
  });

  // 4. Call OpenAI Responses API
  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: MODEL_ID,
        // System instructions go here, not in the input array
        instructions: SYSTEM_INSTRUCTION,
        // Capabilities
        tools: [
          { type: "web_search" } // Allow checking latest regulations if local context is insufficient
        ],
        // Reasoning setup (Specific to gpt-5.2-pro)
        reasoning: {
          effort: "high" 
        },
        // The conversation history / input context
        input: [
          {
            role: "user",
            content: contentParts
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API Error Details:", errorData);
      throw new Error(`OpenAI API Error: ${errorData.error?.message || response.statusText}`);
    }

    const result = await response.json();
    
    // 5. Robust Output Parsing
    // The Responses API returns an 'output' array containing items (messages, tool calls, etc.)
    // We need to extract the text from the assistant's message.
    let fullMarkdown = "";

    if (result.output && Array.isArray(result.output)) {
      for (const item of result.output) {
        if (item.type === "message" && item.role === "assistant") {
          // Iterate through content parts of the message
          if (Array.isArray(item.content)) {
            for (const contentPart of item.content) {
              if (contentPart.type === "output_text") {
                fullMarkdown += contentPart.text;
              }
            }
          }
        }
      }
    }

    if (!fullMarkdown) {
      console.warn("Unexpected response structure:", result);
      throw new Error("No text content generated from OpenAI.");
    }

    return fullMarkdown;

  } catch (error) {
    console.error("OpenAI Service Error:", error);
    throw error;
  }
};