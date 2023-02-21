import {
  Accordion,
  AccordionButton, AccordionIcon,
  AccordionItem, AccordionPanel,
  Button,
  Heading,
  HStack, Popover, PopoverBody, PopoverContent, PopoverHeader, PopoverTrigger,
  Stack,
  Text
} from "@chakra-ui/react";
import {useEffect, useRef, useState} from "react";
import Editor from "@monaco-editor/react";
import {ConnectButton} from "@rainbow-me/rainbowkit";
import {NEST_CRAFT_ADDRESS} from "../../constant/address";
import {NEST_CRAFT_ABI} from "../../constant/abi";
import {useContractRead, useNetwork} from "wagmi";
import {BigNumber} from "ethers";

const Home = () => {
  const {chain} = useNetwork()
  const [text, setText] = useState("");
  const monacoRef = useRef(null);
  const [output, setOutput] = useState<{
    raw: BigNumber | undefined,
    format: string,
  }>({
    raw: undefined,
    format: '',
  });

  const nestCraftContract = {
    address: NEST_CRAFT_ADDRESS[chain?.id || 97],
    abi: NEST_CRAFT_ABI
  }
  const {data: estimateData, status: estimateStatus} = useContractRead({
    ...nestCraftContract,
    functionName: 'estimate',
    args: [text],
    watch: true,
  })

  const run = () => {
    if (estimateStatus === 'success') {
      setOutput({
        raw: BigNumber.from(estimateData),
        format: (BigNumber.from(estimateData).div(BigNumber.from(10).pow(12)).toNumber() / 1000000).toLocaleString('en', {
          maximumFractionDigits: 6
        }) + ' Ether',
      })
    } else if (estimateStatus === 'error') {
      setOutput({
        raw: undefined,
        format: 'error',
      })
    }
  }

  const Operator = [
    {
      name: '基础运算符 Basic Operator',
      children: [
        {
          name: '+',
          value: '+',
          explain: '加法',
        },
        {
          name: '-',
          value: '-',
          explain: '减法',
        },
        {
          name: '*',
          value: '*',
          explain: '乘以',
        },
        {
          name: '/',
          value: '/',
          explain: '除以',
        },
        {
          name: '**',
          value: '**',
          explain: '乘方',
        }
      ]
    }, {
      name: '内置函数 Built-in Function',
      children: [
        {
          name: 'bn()',
          value: 'bn()',
          explain: '获取当前区块号',
        },
        {
          name: 'ts()',
          value: 'ts()',
          explain: '获取当前时间戳',
        },
        {
          name: 'op(int pairIndex)',
          value: 'op(int pairIndex)',
          explain: '从 nestFuturesWithPrice (0xA2D58989ef9981065f749C217984DB21970fF0b7) 合约获取最新价格',
        },
        {
          name: 'oav(int pairIndex, int count)',
          value: 'oav(int pairIndex, int count)',
          explain: '从 nestFuturesWithPrice 获取最新 count 个价格,并计算平均值',
        },
        {
          name: 'ln(int v)',
          value: 'ln(int v)',
          explain: '计算自然对数',
        },
        {
          name: 'exp(int v)',
          value: 'exp(int v)',
          explain: '计算e的指数',
        },
        {
          name: 'flo(int v)',
          value: 'flo(int v)',
          explain: '向下取整',
        },
        {
          name: 'cel(int v)',
          value: 'cel(int v)',
          explain: '向上取整',
        },
        {
          name: 'log(int a, int b)',
          value: 'log(int a, int b)',
          explain: '计算对数',
        },
        {
          name: 'pow(int a, int b)',
          value: 'pow(int a, int b)',
          explain: '计算指数',
        },
      ]
    }, {
      name: '鞅函数 Martingale Function',
      children: [
        {
          name: 'm1(int pairIndex)',
          value: 'm1(int pairIndex)',
          explain: '线性函数, m1 = a * x + c\n其中,pairIndex表示目标代币编号(0:ETH, 1:NEST, 2:BTC)',
        },
        {
          name: 'm2(int pairIndex)',
          value: 'm2(int pairIndex)',
          explain: '平方函数,m2 = a * x ** 2 + c\n其中,pairIndex表示目标代币编号(0:ETH, 1:NEST, 2:BTC)',
        },
        {
          name: 'm3(int pairIndex)',
          value: 'm3(int pairIndex)',
          explain: '倒数函数,m3 = a / x + c\n其中,pairIndex表示目标代币编号(0:ETH, 1:NEST, 2:BTC)',
        },
        {
          name: 'm4(int pairIndex)',
          value: 'm4(int pairIndex)',
          explain: '开方函数,m4 = a * x ** 0.5 + c\n其中,pairIndex表示目标代币编号(0:ETH, 1:NEST, 2:BTC)',
        },
        {
          name: 'm5(int pairIndex)',
          value: 'm5(int pairIndex)',
          explain: '对数函数,m5 = a * ln(x) + c\n其中,pairIndex表示目标代币编号(0:ETH, 1:NEST, 2:BTC)',
        }
      ],
    }
  ]

  return (
    <Stack p={5} h={'100vh'} spacing={5} minW={'container.xl'}>
      <HStack justifyContent={"space-between"}>
        <Stack w={'260px'}>
          <Text></Text>
        </Stack>
        <Heading fontSize={'xl'}>NESTCraft Playground</Heading>
        <Stack w={'260px'} align={"end"}>
          <ConnectButton/>
        </Stack>
      </HStack>
      <HStack h={'full'} spacing={5}>
        <Stack minW={'400px'} bg={'gray.100'} h={'full'} spacing={4} overflow={'scroll'}>
          <Accordion defaultIndex={[0, 1, 2]} allowMultiple borderColor={'transparent'}>
            {
              Operator.map((item, index) => (
                <AccordionItem key={index}>
                  <AccordionButton>
                    <Text w={'full'} textAlign={"start"} fontSize={'xs'} fontWeight={'semibold'}
                          color={'#003434'}>{item.name}</Text>
                    <AccordionIcon/>
                  </AccordionButton>
                  <AccordionPanel px={4} pb={4}>
                    <Stack spacing={1}>
                      {
                        item.children.map((child, childIndex) => (
                          <Popover key={childIndex} trigger={'hover'}>
                            <PopoverTrigger>
                              <Text fontSize={'sm'} cursor={'pointer'} pl={2} color={'#003232'}
                                    onClick={() => {
                                      if (monacoRef) {
                                        // @ts-ignore
                                        const selection = monacoRef.current.getSelection();
                                        const id = {major: 1, minor: 1};
                                        const text = child.value + " ";
                                        const op = {
                                          identifier: id,
                                          range: selection,
                                          text: text,
                                          forceMoveMarkers: true
                                        };
                                        // @ts-ignore
                                        monacoRef.current.executeEdits("my-source", [op]);
                                      }
                                    }}>
                                {child.name}
                              </Text>
                            </PopoverTrigger>
                            <PopoverContent borderRadius={'0'}>
                              <PopoverHeader fontSize={'xs'} color={'#003232'}
                                             fontWeight={'semibold'}>{child.name}</PopoverHeader>
                              <PopoverBody>
                                <Text fontSize={'xs'} color={'#003232'} whiteSpace={'pre-wrap'}>{child.explain}</Text>
                              </PopoverBody>
                            </PopoverContent>
                          </Popover>
                        ))
                      }
                    </Stack>
                  </AccordionPanel>
                </AccordionItem>
              ))
            }
          </Accordion>
        </Stack>
        <Stack w={'full'} h={'full'} spacing={5}>
          <Stack w={'full'} h={'full'} bg={'#1e1e1e'} pt={4}>
            <HStack w={'full'} h={'full'}>
              <Editor
                theme={'vs-dark'}
                className={"py-4"}
                defaultLanguage={"javascript"}
                defaultValue={""}
                height={'100%'}
                width={'60%'}
                onChange={(value) => {
                  setText(value || '')
                }}
                onMount={(editor, monaco) => {
                  if (monacoRef) {
                    // @ts-ignore
                    monacoRef.current = editor
                  }
                }}
              />
              <Stack w={'40%'} h={'full'}>
                <Text color={'#adadad'} whiteSpace={'pre-wrap'} fontSize={'sm'}>
                  规则:<br/>
                  1. 表达式支持加(+)减(-)乘(*)除(/)以及指数运算(**)<br/>
                  2. 表达式优先级 + -,* /,** 三个级别<br/>
                  3. 支持括号表达式,可以用括号改变计算优先级<br/>
                  4. 支持字面值数字(可带小数点),计算过程中数字用18位小数表示,最多允许18位小数<br/>
                  5. 不支持负数字面常量,如需负数,请用(0-47)这样的表达式<br/>
                  6. 支持标识符,标识符以字母开头(区分大小写),后面可以跟字母或数字,最长31个字符<br/>
                  7. 支持函数,包括内置函数和自定义函数,函数可嵌套,函数说明详见末尾的[函数说明]<br/>
                  8. 表达式中所有字符必须是英文半角字符<br/>
                  9. 表达式中各部分之间允许空格<br/>
                  10. 表达式计算结果为18位小数表示<br/>
                </Text>
              </Stack>
            </HStack>
            <HStack px={5} py={4} bg={'#2D2D2D'} justifyContent={"space-between"}>
              <HStack>
                <Text fontSize={'xs'} color={'#ffffff'}
                      fontWeight={'semibold'}>Output: {output.raw?.toString()}</Text>
                <Text fontSize={'xs'} color={'#ADADAD'}>{output.format}</Text>
              </HStack>
              <Button size={'xs'} fontWeight={'semibold'} onClick={run}>Run</Button>
            </HStack>
          </Stack>
          <Stack w={'full'} minH={'200px'} bg={'yellow.200'} p={4} align={"center"} justifyContent={"center"}>
            <Text fontSize={'sm'} fontWeight={'semibold'} color={'#003232'}>创建你的 NESTCraft 表达式</Text>
            <Button size={'sm'} fontWeight={'semibold'}>Create</Button>
          </Stack>
        </Stack>
      </HStack>
    </Stack>
  )
}

export default Home