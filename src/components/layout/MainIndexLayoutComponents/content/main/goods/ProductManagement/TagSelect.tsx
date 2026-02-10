import React, { useState, useEffect, useRef } from 'react';
import { Select, Spin } from 'antd';
import type { TagVO } from '@/api/goods/tag/TagType';
import useTag from '@/stores/goods/Tag';
import type { PageType } from '@/api/type/PageType';

const { Option } = Select;

interface TagSelectProps {
  value?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

const TagSelect: React.FC<TagSelectProps> = ({ value, onChange, placeholder = '请选择标签', disabled }) => {
  const { findAllTagByApi } = useTag();
  const [tags, setTags] = useState<TagVO[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const scrollLoading = useRef(false);

  const PAGE_SIZE = 20;

  // 加载标签数据
  const loadTags = async (pageNum: number, searchText: string) => {
    if (scrollLoading.current) return;
    
    scrollLoading.current = true;
    setLoading(true);

    try {
      const requestData: PageType<TagVO> = {
        pageNum,
        pageSize: PAGE_SIZE,
        condition: {
          name: searchText || undefined,
        } as TagVO,
      };

      const result = await findAllTagByApi(requestData);
      
      if (result) {
        const newTags = pageNum === 1 ? result.rows || [] : [...tags, ...(result.rows || [])];
        setTags(newTags);
        setHasMore(result.rows && result.rows.length === PAGE_SIZE);
      }
    } catch (error) {
      console.error('加载标签失败:', error);
    } finally {
      setLoading(false);
      scrollLoading.current = false;
    }
  };

  // 搜索标签
  const handleSearch = (value: string) => {
    setSearchValue(value);
    setPage(1);
    loadTags(1, value);
  };

  // 处理滚动到底部
  const handlePopupScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { target } = e;
    if (!(target instanceof HTMLDivElement)) return;

    const { scrollTop, clientHeight, scrollHeight } = target;
    if (scrollHeight - scrollTop - clientHeight < 1 && !loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadTags(nextPage, searchValue);
    }
  };

  // 初始加载
  useEffect(() => {
    loadTags(1, '');
  }, []);

  return (
    <Select
      mode="multiple"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onSearch={handleSearch}
      onPopupScroll={handlePopupScroll}
      filterOption={false}
      showSearch
      disabled={disabled}
      loading={loading}
      notFoundContent={loading ? <Spin size="small" /> : null}
      style={{ width: '100%' }}
    >
      {tags.map((tag) => (
        <Option key={tag.id} value={tag.id}>
          {tag.name}
        </Option>
      ))}
      {loading && hasMore && (
        <Option key="loading" disabled value="loading">
          <Spin size="small" style={{ marginRight: 8 }} /> 加载更多...
        </Option>
      )}
    </Select>
  );
};

export default TagSelect;