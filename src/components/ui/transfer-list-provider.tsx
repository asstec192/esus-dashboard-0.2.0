import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

type TransferListContextType = {
  sourceList: Option[];
  destinationList: Option[];
  setDestinationList: Dispatch<SetStateAction<Option[]>>;
};

type TransferListProviderProps = {
  children: ReactNode;
  sourceList: Option[];
  destinationList?: Option[];
};

const TransferListContext = createContext({} as TransferListContextType);
export const useTransferList = () => useContext(TransferListContext);

export const TransferlistProvider = ({
  children,
  sourceList,
  destinationList,
}: TransferListProviderProps) => {
  const [_destinationList, setDestinationList] = useState<Option[]>(
    destinationList || [],
  );

  //filtra a lista fonte ocultando nela o que esta na lista de destino
  const _sourceList = sourceList.filter(
    (option) => !_destinationList.some((opt) => opt.value === option.value),
  );
  return (
    <TransferListContext.Provider
      value={{
        sourceList: _sourceList,
        destinationList: _destinationList,
        setDestinationList,
      }}
    >
      {children}
    </TransferListContext.Provider>
  );
};
