import {Fragment, useEffect, useState} from "react";
import {Dialog, Listbox, Transition} from "@headlessui/react";
import {CheckIcon, ChevronUpDownIcon} from '@heroicons/react/20/solid'
import {XCircleIcon} from "@heroicons/react/24/solid";
import {
  erc20ABI,
  useAccount,
  useConnect,
  useContractRead,
  useContractWrite,
  useDisconnect,
  useNetwork,
  usePrepareContractWrite
} from "wagmi";
import {InjectedConnector} from 'wagmi/connectors/injected';
import {NEST_CRAFT_ABI} from "@/constant/abi";
import {NEST_ADDRESS, NEST_CRAFT_ADDRESS} from "@/constant/address";
import {bscTestnet} from "wagmi/chains";
import {ExpressionSubItem, Functions} from "@/constant/functions";
import { motion } from "framer-motion";

const tokens = [
  {name: 'ETH', value: 0},
  {name: 'BTC', value: 1},
  {name: 'BNB', value: 2},
]

const Draft = () => {
  const {address, isConnected} = useAccount()
  const {connect} = useConnect({
    // @ts-ignore
    connector: new InjectedConnector(),
  })
  const {disconnect} = useDisconnect()
  const [showFunction, setShowFunction] = useState(true)
  const [showExecution, setExecution] = useState(true)
  const [expression, setExpression] = useState<ExpressionSubItem[]>([])
  const [isOpenInsertFunction, setIsOpenInsertFunction] = useState(false)
  const [expressionSubItem, setExpressionSubItem] = useState<ExpressionSubItem>({
    coefficient: 1,
    function: '',
    description: '',
    argument: null
  })
  const {chain} = useNetwork()
  const [expr, setExpr] = useState<string | undefined>(undefined)
  const {data: estimateData, isLoading: isEstimateLoading, error} = useContractRead({
    abi: NEST_CRAFT_ABI,
    address: NEST_CRAFT_ADDRESS[chain?.id ?? bscTestnet.id],
    args: [
      expr,
    ],
    chainId: chain?.id ?? bscTestnet.id,
    functionName: 'estimate',
    cacheTime: 3_000,
    watch: true,
  })
  const {data: allowanceData} = useContractRead({
    abi: erc20ABI,
    address: NEST_ADDRESS[chain?.id ?? bscTestnet.id],
    functionName: 'allowance',
    args: [
      address!,
      NEST_CRAFT_ADDRESS[chain?.id ?? bscTestnet.id],
    ],
    cacheTime: 3_000,
    watch: true,
  })
  const {config: buyPrepareConfig} = usePrepareContractWrite({
    address: NEST_CRAFT_ADDRESS[chain?.id ?? bscTestnet.id],
    abi: NEST_CRAFT_ABI,
    functionName: 'buy',
    args: [
      expr,
    ],
    chainId: chain?.id ?? bscTestnet.id,
  })
  const {
    write: buy,
    status: buyStatus,
    reset: resetBuy,
  } = useContractWrite(buyPrepareConfig)
  const {config: approvePrepareConfig} = usePrepareContractWrite({
    address: NEST_ADDRESS[chain?.id ?? bscTestnet.id],
    abi: erc20ABI,
    functionName: 'approve',
    args: [
      NEST_CRAFT_ADDRESS[chain?.id ?? bscTestnet.id],
      BigInt(10000000000000000)
    ],
    chainId: chain?.id ?? bscTestnet.id,
  })
  const {
    write: approve,
    status: approveStatus,
    reset: resetApprove,
  } = useContractWrite(approvePrepareConfig)

  useEffect(() => {
    if (approveStatus === 'success' || approveStatus === 'error') {
      // 3s后
      setTimeout(() => {
        resetApprove()
      }, 3_000)
    }
  }, [approveStatus, resetApprove])

  useEffect(() => {
    if (buyStatus === 'success' || buyStatus === 'error') {
      setTimeout(() => {
        resetBuy()
      }, 3_000)
    }
  }, [buyStatus, resetBuy])

  useEffect(() => {
    if (expression.length > 0) {
      // 遍历所有的函数，组合成表达式
      let expr = ''
      expression.forEach((item, index) => {
        if (index === 0) {
          expr += `${item.coefficient}*${item.function}(${item.argument?.value})`
        } else {
          expr += `+${item.coefficient}*${item.function}(${item.argument?.value})`
        }
      })
      expr = expr.replace(/1\*/g, '')
      setExpr(expr)
    } else {
      setExpr(undefined)
    }
  }, [expression])

  const InsertModal = () => {
    return (
      <Transition appear show={isOpenInsertFunction} as={"div"} className={'w-full h-full absolute z-50'}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsOpenInsertFunction(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25"/>
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all flex flex-col gap-4">
                  <div className="text-xl font-bold leading-6 text-gray-900">
                    Insert function
                  </div>
                  <div>
                    <div className={'font-bold'}>
                      {expressionSubItem?.function}
                    </div>
                    <div>
                      {expressionSubItem?.description}
                    </div>
                  </div>
                  <div className="mt-2 flex flex-col gap-2">
                    {
                      expressionSubItem?.argument && (
                        <>
                          <label className={'text-sm'}>
                            argument
                          </label>
                          {
                            expressionSubItem?.argument?.type === 'token' ? (
                              <Listbox value={expressionSubItem.argument} onChange={(e) => {
                                setExpressionSubItem({
                                  ...expressionSubItem,
                                  // @ts-ignore
                                  argument: {
                                    ...expressionSubItem.argument,
                                    name: e.name,
                                    value: e.value,
                                  }
                                })
                              }}>
                                <div className="relative mt-1">
                                  <Listbox.Button
                                    className="relative w-full cursor-default rounded bg-white py-2 pl-3 pr-10 text-left border focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                                    <div className="block truncate">{expressionSubItem?.argument?.name}</div>
                                    <div
                                      className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                      <ChevronUpDownIcon
                                        className="h-5 w-5 text-gray-400"
                                        aria-hidden="true"
                                      />
                                    </div>
                                  </Listbox.Button>
                                  <Transition
                                    as={Fragment}
                                    leave="transition ease-in duration-100"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                  >
                                    <Listbox.Options
                                      className="absolute mt-1 max-h-40 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                      {tokens.map((token, index) => (
                                        <Listbox.Option
                                          key={index}
                                          className={({active}) =>
                                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                              active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                                            }`
                                          }
                                          value={token}
                                        >
                                          {({selected}) => (
                                            <>
                                              <div
                                                className={`block truncate ${
                                                  selected ? 'font-medium' : 'font-normal'
                                                }`}
                                              >
                                                {token.name}
                                              </div>
                                              {selected ? (
                                                <div
                                                  className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                                  <CheckIcon className="h-5 w-5" aria-hidden="true"/>
                                                </div>
                                              ) : null}
                                            </>
                                          )}
                                        </Listbox.Option>
                                      ))}
                                    </Listbox.Options>
                                  </Transition>
                                </div>
                              </Listbox>
                            ) : (
                              <input className={'w-full h-10 border px-3 rounded'} onChange={(e) => setExpressionSubItem({
                                ...expressionSubItem,
                                // @ts-ignore
                                argument: {
                                  ...expressionSubItem.argument,
                                  value: e.target.value
                                }
                              })}/>
                            )
                          }
                        </>
                      )
                    }
                    <label className={'text-sm'}>
                      coefficient
                    </label>
                    <input className={'w-full h-10 border px-3 rounded'}
                           value={expressionSubItem.coefficient} onChange={(e) => setExpressionSubItem({
                      ...expressionSubItem,
                      coefficient: Number(e.target.value)
                    })}/>
                  </div>
                  <div className="flex gap-2 justify-end mt-[64px]">
                    <button
                      className="border px-3 py-2 rounded font-bold w-20 bg-neutral-700 text-white"
                      onClick={() => {
                        const index = expression.findIndex(item => item.function === expressionSubItem.function && item.argument?.name === expressionSubItem.argument?.name)
                        if (index >= 0) {
                          setExpression([
                            ...expression.slice(0, index),
                            {
                              ...expression[index],
                              coefficient: expressionSubItem.coefficient + expression[index].coefficient,
                            },
                            ...expression.slice(index + 1, expression.length),
                          ])
                        } else {
                          setExpression([
                            ...expression,
                            expressionSubItem,
                          ])
                        }
                        setIsOpenInsertFunction(false)
                      }}
                    >
                      Add
                    </button>
                    <button
                      className="border px-3 py-2 rounded font-bold w-20 text-neutral-700"
                      onClick={() => {
                        setIsOpenInsertFunction(false)
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    )
  }

  const MFunctionModal = () => {
    return (
      <div
        className={'absolute z-10 bottom-0 left-4 bg-white rounded-tl-xl rounded-tr-xl w-80 border font-bold flex flex-col overflow-hidden'}>
        <div
          className={'font-bold text-xl border-b px-3 h-12 flex items-center cursor-pointer hover:bg-neutral-50'}
          onClick={() => setShowFunction(!showFunction)}
        >
          Martingale Functions
        </div>
        <Transition
          as={Fragment}
          show={showFunction}
          enter="ease-out duration-100"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className={`flex flex-col gap-3 p-3 overflow-y-auto pb-20`}>
            {
              Functions.map((item, index) => (
                <div key={index}
                     className={'bg-white p-3 rounded-xl text-neutral-700 border font-medium text-sm group hover:shadow hover:bg-neutral-50'}>
                  <div className={'flex items-center gap-2 justify-between'}>
                    <div className={'flex gap-1'}>
                      {item.function}
                      <div className={'flex text-neutral-700 font-light text-xs items-center gap-0.5'}>
                        <div>(</div>
                        <div key={index}>
                          {item?.argument?.name}
                        </div>
                        <div>)</div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setExpressionSubItem(item)
                        setIsOpenInsertFunction(true)
                      }}
                      className={'border bg-white hover:bg-neutral-100 p-1 rounded-full w-8 h-8 text-neutral-700 opacity-0 group-hover:opacity-100'}>
                      +
                    </button>
                  </div>
                  <div className={'text-xs text-neutral-700 font-light'}>
                    {item.description}
                  </div>
                </div>
              ))
            }
          </div>
        </Transition>
      </div>
    )
  }

  const EstimateModal = () => {
    return (
      <div
        className={'absolute z-10 bottom-0 right-4 bg-white rounded-tl-xl rounded-tr-xl w-80 border font-bold overflow-hidden'}>
        <div
          className={'font-bold text-xl border-b px-3 py-2 min-h-12 flex items-center justify-between cursor-pointer hover:bg-neutral-50'}
          onClick={() => setExecution(!showExecution)}
        >
          <div>
            Estimate
          </div>
          <div className={'text-neutral-700 font-light'}>
            {/*@ts-ignore*/}
            {estimateData ? `${(parseInt(BigInt(estimateData).toString()) / 1e18).toLocaleString('en-US', {
              maximumFractionDigits: 6
            })} NEST` : ''}
          </div>
        </div>
        <Transition
          as={Fragment}
          show={expression.length > 0 && showExecution}
          enter="ease-out duration-100"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className={`flex flex-col gap-3 p-3 overflow-y-auto overflow-x-hidden`}>
            <div className={'italic font-light text-xs w-full break-all underline'}>
              expr: {expr}
            </div>
            {
              // @ts-ignore
              allowanceData !== undefined && (BigInt(allowanceData || 0) < BigInt(estimateData || 0)) && (
                <button onClick={approve} disabled={!approve}
                        className={'bg-neutral-700 p-2 text-white rounded font-bold disabled:cursor-not-allowed disabled:bg-red-200'}>
                  {approveStatus === 'loading' && 'Approving...'}
                  {approveStatus === 'idle' && 'Approve'}
                  {approveStatus === 'success' && 'Approve Success'}
                  {approveStatus === 'error' && 'Approve Error'}
                </button>
              )
            }
            <button
              className={'bg-neutral-700 p-2 text-white rounded font-bold disabled:cursor-not-allowed disabled:bg-red-200'}
              disabled={!buy} onClick={buy}>
              {buyStatus === 'loading' && 'Buying...'}
              {buyStatus === 'idle' && 'Buy'}
              {buyStatus === 'success' && 'Buy Success'}
              {buyStatus === 'error' && 'Buy Error'}
            </button>
          </div>
        </Transition>
      </div>
    )
  }

  const Header = () => {
    return (
      <div className={'h-16 flex items-center justify-between px-4 font-bold border-b'}>
        <div>
          NEST Craft
        </div>
        {
          isConnected ? (
            <button onClick={() => disconnect()}>
              Connected to {address?.slice(0, 6)}...{address?.slice(-4)}
            </button>
          ) : (
            <button onClick={() => connect()}>
              Connect Wallet
            </button>
          )
        }
      </div>
    )
  }

  const Content = () => {
    return (
      <div
        style={{
          backgroundImage: 'radial-gradient(#bbb 5%, transparent 0)',
          backgroundSize: '40px 40px',
        }}
        className={'z-0 w-full h-full bg-white flex flex-col justify-center items-center font-bold sm:text-base md:text-xl lg:text-3xl xl:text-5xl overflow-hidden'}>
        <motion.div
          drag
        >
          <div className={'bg-white p-10 border rounded-xl shadow-sm flex gap-2 items-center cursor-move hover:shadow-lg max-w-full'}>
            {
              expression
                .map((item, index) => {
                  return (
                    <span key={index} className={'flex items-center gap-2'}>
                      <span
                        className={'hover:bg-neutral-100 rounded flex gap-2 p-2 items-center relative group cursor-pointer whitespace-nowrap'}>
                        <div
                          onClick={() => {
                            const newExpression = [...expression]
                            newExpression.splice(index, 1)
                            setExpression(newExpression)
                          }}
                          className={'absolute text-sm right-[-10px] top-[-10px] opacity-0 group-hover:opacity-100'}>
                          <XCircleIcon className={'w-6 fill-red-100 hover:fill-red-400'}/>
                        </div>
                        {
                          item.coefficient !== 1 && (
                            <span>
                              {item.coefficient} *
                            </span>
                          )
                        }
                        <span className={'italic'}>{item.function}</span>
                        <span className={'sm:text-sm md:text-lg lg:text-xl xl:text-3xl'}>
                          ({item.argument?.name})
                        </span>
                      </span>
                      {
                        index !== expression.length - 1 && (
                          <span>+</span>
                        )
                      }
                    </span>
                  )
                })
            }
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <main className={'h-screen w-screen flex flex-col relative'}>
      {InsertModal()}
      {Header()}
      {Content()}
      {MFunctionModal()}
      {EstimateModal()}
    </main>
  )
}

export default Draft