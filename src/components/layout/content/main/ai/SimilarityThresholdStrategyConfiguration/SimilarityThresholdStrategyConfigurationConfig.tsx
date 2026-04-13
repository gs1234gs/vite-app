import type { TableColumnsType } from "antd";
import type { SimilarityThresholdStrategyConfigurationVO } from "@/api/ai/similarity/SimilarityThresholdStrategyConfigurationType";

export const similarityFormList = [
    {
        label: "相似度阈值",
        name: "similarityThreshold",
        type: "inputNumber",
        addonAfter: "%",
        min: 0,
        max: 100,
        step: 0.1,
        precision: 2,
        rules: {
            required: true,
            message: "请输入相似度阈值"
        }
    }
];

export interface DataType extends SimilarityThresholdStrategyConfigurationVO {
  key: React.Key;
}

export const columns: TableColumnsType<DataType> = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 200,
  },
  {
    title: '相似度阈值',
    dataIndex: 'similarityThreshold',
    key: 'similarityThreshold',
    width: 150,
    render: (value: number) => {
      // 后端存储的是小数（0.85），显示时转换为百分比（85%）
      return `${(value * 100).toFixed(2)}%`;
    },
  },
  {
    title: '创建者',
    dataIndex: 'creator',
    key: 'creator',
    width: 120,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 180,
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    key: 'updateTime',
    width: 180,
  }
];
