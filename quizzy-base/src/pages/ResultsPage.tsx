
import Sheet, { withSheetRow, Column } from "#/components/Sheet";
import { QuizResult } from "#/types";
import { Quizzy } from "@/data";
import { useAsyncEffect } from "@/utils/react";
import { Button, HStack } from "@chakra-ui/react";
import { atom, useAtom } from "jotai";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";


const resultsAtom = atom<readonly QuizResult[]>([]);

type _K = {
  refresh: () => void | Promise<void>,
};
const GotoButton = withSheetRow<QuizResult, _K>((props) => {
  const { item, refresh } = props;

  const { t } = useTranslation();
  const navigate = useNavigate();

  if (!item) {
    return <></>;
  }
  return <HStack>
    <Button onClick={() => {
      navigate('/result/' + item.id);
    }} colorScheme="blue">
      {t('btn.goto')}
    </Button>
    <Button onClick={async () => {
      await Quizzy.deleteQuizResult(item.id);
      await refresh();
    }} colorScheme='red'>
      {t('btn.delete')}
    </Button>
  </HStack>;
});

export const ResultsPage = () => {
  const [results, setResults] = useAtom(resultsAtom);

  // refresh results
  const refresh = () => Quizzy.listQuizResults().then(setResults);
  useAsyncEffect(refresh, []);

  return <Sheet data={results}>
    <Column field='paperName' />
    <Column field='startTime' />
    <Column field='timeUsed' />
    <Column field='score' />
    <Column field='total' />
    <Column>
      <GotoButton refresh={refresh} />
    </Column>
  </Sheet>

};

export default ResultsPage;
