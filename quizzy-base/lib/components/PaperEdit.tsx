import { QuizPaper } from "#/types";
import { useDisclosureWithData } from "#/utils/disclosure";
import { AddIcon } from "@chakra-ui/icons";
import {
  Box, Button, Grid, HStack, IconButton,
  Input, InputProps, Modal, ModalBody, ModalCloseButton, ModalContent,
  ModalFooter, ModalHeader, ModalOverlay,
  Tag, VStack, Wrap
} from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useEditorContext } from "#/utils/react-patch";
import { getChangedArray, Textarea2 } from "./QuestionEdit";


export const PaperEdit = () => {

  const { value: paper, onChangeImmediate, edit } = useEditorContext<QuizPaper>();

  const { t } = useTranslation();

  // tags

  const { data: editTag, ...dTag } = useDisclosureWithData<{
    index?: number,
    orig?: string,
    isCategory?: boolean,
  }>({});

  const [currentTag, setCurrentTag] = useState('');

  const startEditingTag = useCallback((index?: number, isCategory = false) => {
    const origArr = isCategory ? paper.categories : paper.tags;
    const orig = (index == null ? undefined : origArr?.[index]) ?? '';
    setCurrentTag(orig);
    dTag.onOpen({ index, orig, isCategory });
  }, [dTag.onOpen, setCurrentTag, paper]);

  const submitTag = useCallback(async () => {
    const { isCategory, index } = editTag;
    const origArr = (isCategory ? paper.categories : paper.tags) ?? [];
    await onChangeImmediate({
      [isCategory ? 'categories' : 'tags']: index == null
        ? [...origArr, currentTag]
        : getChangedArray(origArr, index, currentTag)
    });
    dTag.onClose();
  }, [onChangeImmediate, currentTag, editTag, paper]);

  return <>
    <Grid templateColumns='160px 1fr' gap={2}>

      {/* title */}
      <Box>{t('page.edit.title')}</Box>
      <Input {...edit('name', { debounce: true })} />
      {/* <EditButton value={editingTitle} setValue={setEditingTitle} /> */}

      {/* tags */}
      <Box>{t('page.edit.tags')}</Box>
      <Wrap>
        {(paper.tags ?? []).map((t, i) => <Tag key={t}
          onDoubleClick={() => startEditingTag(i)}
        ><Box>{t}</Box></Tag>)}

        <IconButton
          onClick={() => startEditingTag(undefined)}
          aria-label={t('page.edit.addButton')}
          size='xs'
          icon={<AddIcon />}
        />
      </Wrap>

      {/* categories */}
      <Box>{t('page.edit.categories')}</Box>
      <Wrap>
        {(paper.categories ?? []).map((t, i) => <Tag key={t}
          onDoubleClick={() => startEditingTag(i, true)}
        ><Box>{t}</Box></Tag>)}

        <IconButton
          onClick={() => startEditingTag(undefined, true)}
          aria-label={t('page.edit.addButton')}
          size='xs'
          icon={<AddIcon />}
        />
      </Wrap>

      {/* duration */}
      <Box>{t('page.edit.duration')}</Box>
      <Input {...edit<InputProps, number>('duration', {
        debounce: true,
        get: (x) => String(x / (60 * 1000)),
        set: (x) => Number(x) * 60 * 1000,
      })} />

      {/* content */}
      <Box>{t('page.edit.desc')}</Box>
      <HStack alignItems='flex-end' alignSelf='flex-end'>
        <Textarea2 {...edit('desc', { debounce: true })} />
      </HStack>


    </Grid>

    <Modal {...dTag} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>{t('page.edit.modal.tag.title')}</ModalHeader>
        <ModalBody as={VStack}>
          <Input value={currentTag} onChange={(e) => setCurrentTag(e.target.value)} />
        </ModalBody>
        <ModalFooter justifyContent='space-between'>
          <Button colorScheme='red' onClick={dTag.onClose}>{t('btn.cancel')}</Button>
          <Button colorScheme='blue' onClick={submitTag}>{t('btn.save')}</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  </>;
};