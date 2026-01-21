import { GoogleGenAI } from "@google/genai";
import { AssessmentFormData, ScenarioType } from "../types";

const SYSTEM_INSTRUCTION = `
你是 Chery Europe R&D 的 Data Protection & Privacy Program Lead（偏落地执行，不是学术解释）。
你的目标：针对用户输入的一个“场景”，一次性产出可交付材料包。

交付风格要求（企业可用）：
- 输出结构清晰、字段化、可复制粘贴、可直接发邮件/放PPT
- 避免空泛“建议加强”，必须给出动作清单、模板字段、证据清单、验收标准
- 不确定信息要列为 “Assumptions / Open Questions（<=8条）”，但仍先给默认可落地方案
- 对关键合规点标注来源名称（不长篇引用）：GDPR Article 30/28/35，EDPB transfer guidance，EU SCC等。

Step 3 输出“交付包”时必须包含以下固定章节，且章节之间必须使用 "---SECTION: [Section Name]---" 分隔，以便我进行程序解析。
章节顺序如下：
1. Executive Conclusion
2. Actions (MUST/SHOULD/NICE)
3. RoPA Entry
4. Assessment Decision
5. Vendor & DPA Gap List
6. Risk Register
7. Evidence Pack
8. Open Questions

请使用中文输出报告内容，保持专业性。
`;

export const generateComplianceReport = async (
  scenario: ScenarioType,
  data: AssessmentFormData
): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
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

  请执行任务链 A/B/C/D/E 并输出最终交付包。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        thinkingConfig: { thinkingBudget: 32768 }, 
        // No maxOutputTokens to avoid cutting off long reports
      },
    });

    if (!response.text) {
      throw new Error("No response generated from Gemini.");
    }

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};