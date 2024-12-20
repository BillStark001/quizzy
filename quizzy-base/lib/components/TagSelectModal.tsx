import { KeywordIndexed } from "#/types/technical";
import {
  Button, Input, Modal, ModalBody,
  ModalCloseButton, ModalContent, ModalFooter,
  ModalHeader, ModalOverlay, ModalProps, Tag, useCallbackRef, VStack,
  Wrap
} from "@chakra-ui/react";
import { useState, useCallback, useEffect, useRef } from "react";
import { getChangedArray } from "./QuestionEdit";
import { useTranslation } from "react-i18next";
import { TagSearchResult } from "#/types";
import { Quizzy } from "@/data";
import { debounce, DebounceReturn } from "#/utils/debounce";

export type TagSelectState = {
  tagIndex?: number,
  isCategory?: boolean,
};

const _d = (): TagSearchResult => ({
  question: [], questionTags: [], paper: [], paperTags: [],
});

export const TagSelectModal = (props: Omit<ModalProps, 'children'> & {
  object: Readonly<KeywordIndexed>,
  onChange: (patch: Partial<KeywordIndexed>) => void,
  dbIndex?: string,
} & TagSelectState) => {

  const {
    isCategory, tagIndex,
    object, onChange,
    ...modalProps
  } = props;

  const { isOpen, onClose } = modalProps;

  const { t } = useTranslation();

  const [currentTag, setCurrentTag] = useState('');
  const [origArr, setOrigArr] = useState<readonly string[]>([]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const origArr = (isCategory ? object.categories : object.tags) ?? [];
    setOrigArr(origArr ?? []);
    const orig = (tagIndex == null ? undefined : origArr?.[tagIndex]) ?? '';
    setCurrentTag(orig);
  }, [isOpen]);

  const submitTag = useCallback(async () => {
    await onChange({
      [isCategory ? 'categories' : 'tags']: tagIndex == null
        ? [...origArr, currentTag]
        : getChangedArray(origArr, tagIndex, currentTag)
    });
    onClose();
  }, [onChange, onClose, currentTag, isCategory, tagIndex, origArr]);

  // display list
  const [listExpanded, setListExpanded] = useState(false);
  const [tagSearch, setTagSearch] = useState(_d);

  const performSearch = useCallback(async (currentTag: string) => {
    const result = currentTag ? await Quizzy.findTags(currentTag) : undefined;
    const l = result
      ? result.paper.length + result.paperTags.length + result.question.length + result.questionTags.length
      : 0;
    if (l) {
      setListExpanded(true);
      setTagSearch(result!);
    } else {
      setListExpanded(false);
    }
  }, [currentTag]);

  const performSearchRef = useCallbackRef(performSearch);

  const debouncedSearch = useRef<DebounceReturn<typeof performSearch>>(undefined);
  useEffect(() => {
    debouncedSearch.current?.clear();
    debouncedSearch.current = debounce(performSearch, 500);
  }, [performSearchRef, debouncedSearch]);

  return <Modal closeOnOverlayClick={false} {...modalProps}>
    <ModalOverlay />
    <ModalContent>
      <ModalCloseButton />
      <ModalHeader>{t('page.edit.modal.tag.title')}</ModalHeader>
      <ModalBody as={VStack} alignItems='stretch'>
        <Input value={currentTag} onChange={(e) => {
          setCurrentTag(e.target.value);
          debouncedSearch.current?.(e.target.value);
        }} />
        {listExpanded && <>
          <Wrap>{tagSearch.question.map(x => <Tag key={x}>{x}</Tag>)}</Wrap>
          <Wrap>{tagSearch.questionTags.map(x => <Tag key={x}>{x}</Tag>)}</Wrap>
          <Wrap>{tagSearch.paper.map(x => <Tag key={x}>{x}</Tag>)}</Wrap>
          <Wrap>{tagSearch.paperTags.map(x => <Tag key={x}>{x}</Tag>)}</Wrap>
        </>}
      </ModalBody>
      <ModalFooter justifyContent='space-between'>
        <Button colorScheme='red' onClick={onClose}>{t('btn.cancel')}</Button>
        <Button colorScheme='blue' onClick={submitTag}>{t('btn.save')}</Button>
      </ModalFooter>
    </ModalContent>
  </Modal>;
};

export default TagSelectModal;