import { isObject, hasProperty, remove0x, add0x } from '@metamask/utils';
import { decode } from '@metamask/abi-utils';
import { ethers } from 'ethers';

/**
 * As an example, get transaction insights by looking at the transaction data
 * and attempting to decode it.
 *
 * @param transaction - The transaction to get insights for.
 * @returns The transaction insights.
 */
export async function getInsights(transaction: Record<string, unknown>) {
  const mobyMaskAddress = '0xB06E6DB9288324738f04fCAAc910f5A60102C1F8';

  const hexChainId = await wallet.request({ method: 'eth_chainId' });
  const chainId = parseInt(`${hexChainId}`, 16);

  const returnObject: Record<string, any> = {};

  try {
    // Check if the transaction has data.
    if (
      !isObject(transaction) ||
      !hasProperty(transaction, 'data') ||
      typeof transaction.data !== 'string'
    ) {
      throw 'Transaction data received is not an object.';
    } else if (chainId !== 1) {
      throw 'Not on Ethereum mainnet.';
    }

    const mobyMaskABI = [
      {
        inputs: [{ internalType: 'string', name: 'name', type: 'string' }],
        stateMutability: 'nonpayable',
        type: 'constructor',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: 'address',
            name: 'principal',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'agent',
            type: 'address',
          },
        ],
        name: 'DelegationTriggered',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'string',
            name: 'entity',
            type: 'string',
          },
          {
            indexed: false,
            internalType: 'bool',
            name: 'isMember',
            type: 'bool',
          },
        ],
        name: 'MemberStatusUpdated',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'previousOwner',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'newOwner',
            type: 'address',
          },
        ],
        name: 'OwnershipTransferred',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'string',
            name: 'entity',
            type: 'string',
          },
          {
            indexed: false,
            internalType: 'bool',
            name: 'isPhisher',
            type: 'bool',
          },
        ],
        name: 'PhisherStatusUpdated',
        type: 'event',
      },
      {
        inputs: [
          {
            components: [
              { internalType: 'address', name: 'enforcer', type: 'address' },
              { internalType: 'bytes', name: 'terms', type: 'bytes' },
            ],
            internalType: 'struct Caveat[]',
            name: '_input',
            type: 'tuple[]',
          },
        ],
        name: 'GET_CAVEAT_ARRAY_PACKETHASH',
        outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
        stateMutability: 'pure',
        type: 'function',
      },
      {
        inputs: [
          {
            components: [
              { internalType: 'address', name: 'enforcer', type: 'address' },
              { internalType: 'bytes', name: 'terms', type: 'bytes' },
            ],
            internalType: 'struct Caveat',
            name: '_input',
            type: 'tuple',
          },
        ],
        name: 'GET_CAVEAT_PACKETHASH',
        outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
        stateMutability: 'pure',
        type: 'function',
      },
      {
        inputs: [
          {
            components: [
              { internalType: 'address', name: 'delegate', type: 'address' },
              { internalType: 'bytes32', name: 'authority', type: 'bytes32' },
              {
                components: [
                  {
                    internalType: 'address',
                    name: 'enforcer',
                    type: 'address',
                  },
                  { internalType: 'bytes', name: 'terms', type: 'bytes' },
                ],
                internalType: 'struct Caveat[]',
                name: 'caveats',
                type: 'tuple[]',
              },
            ],
            internalType: 'struct Delegation',
            name: '_input',
            type: 'tuple',
          },
        ],
        name: 'GET_DELEGATION_PACKETHASH',
        outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
        stateMutability: 'pure',
        type: 'function',
      },
      {
        inputs: [
          {
            components: [
              { internalType: 'string', name: 'name', type: 'string' },
              { internalType: 'string', name: 'version', type: 'string' },
              { internalType: 'uint256', name: 'chainId', type: 'uint256' },
              {
                internalType: 'address',
                name: 'verifyingContract',
                type: 'address',
              },
            ],
            internalType: 'struct EIP712Domain',
            name: '_input',
            type: 'tuple',
          },
        ],
        name: 'GET_EIP712DOMAIN_PACKETHASH',
        outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
        stateMutability: 'pure',
        type: 'function',
      },
      {
        inputs: [
          {
            components: [
              {
                internalType: 'bytes32',
                name: 'delegationHash',
                type: 'bytes32',
              },
            ],
            internalType: 'struct IntentionToRevoke',
            name: '_input',
            type: 'tuple',
          },
        ],
        name: 'GET_INTENTIONTOREVOKE_PACKETHASH',
        outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
        stateMutability: 'pure',
        type: 'function',
      },
      {
        inputs: [
          {
            components: [
              {
                components: [
                  {
                    components: [
                      { internalType: 'address', name: 'to', type: 'address' },
                      {
                        internalType: 'uint256',
                        name: 'gasLimit',
                        type: 'uint256',
                      },
                      { internalType: 'bytes', name: 'data', type: 'bytes' },
                    ],
                    internalType: 'struct Transaction',
                    name: 'transaction',
                    type: 'tuple',
                  },
                  {
                    components: [
                      {
                        components: [
                          {
                            internalType: 'address',
                            name: 'delegate',
                            type: 'address',
                          },
                          {
                            internalType: 'bytes32',
                            name: 'authority',
                            type: 'bytes32',
                          },
                          {
                            components: [
                              {
                                internalType: 'address',
                                name: 'enforcer',
                                type: 'address',
                              },
                              {
                                internalType: 'bytes',
                                name: 'terms',
                                type: 'bytes',
                              },
                            ],
                            internalType: 'struct Caveat[]',
                            name: 'caveats',
                            type: 'tuple[]',
                          },
                        ],
                        internalType: 'struct Delegation',
                        name: 'delegation',
                        type: 'tuple',
                      },
                      {
                        internalType: 'bytes',
                        name: 'signature',
                        type: 'bytes',
                      },
                    ],
                    internalType: 'struct SignedDelegation[]',
                    name: 'authority',
                    type: 'tuple[]',
                  },
                ],
                internalType: 'struct Invocation[]',
                name: 'batch',
                type: 'tuple[]',
              },
              {
                components: [
                  { internalType: 'uint256', name: 'nonce', type: 'uint256' },
                  { internalType: 'uint256', name: 'queue', type: 'uint256' },
                ],
                internalType: 'struct ReplayProtection',
                name: 'replayProtection',
                type: 'tuple',
              },
            ],
            internalType: 'struct Invocations',
            name: '_input',
            type: 'tuple',
          },
        ],
        name: 'GET_INVOCATIONS_PACKETHASH',
        outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
        stateMutability: 'pure',
        type: 'function',
      },
      {
        inputs: [
          {
            components: [
              {
                components: [
                  { internalType: 'address', name: 'to', type: 'address' },
                  {
                    internalType: 'uint256',
                    name: 'gasLimit',
                    type: 'uint256',
                  },
                  { internalType: 'bytes', name: 'data', type: 'bytes' },
                ],
                internalType: 'struct Transaction',
                name: 'transaction',
                type: 'tuple',
              },
              {
                components: [
                  {
                    components: [
                      {
                        internalType: 'address',
                        name: 'delegate',
                        type: 'address',
                      },
                      {
                        internalType: 'bytes32',
                        name: 'authority',
                        type: 'bytes32',
                      },
                      {
                        components: [
                          {
                            internalType: 'address',
                            name: 'enforcer',
                            type: 'address',
                          },
                          {
                            internalType: 'bytes',
                            name: 'terms',
                            type: 'bytes',
                          },
                        ],
                        internalType: 'struct Caveat[]',
                        name: 'caveats',
                        type: 'tuple[]',
                      },
                    ],
                    internalType: 'struct Delegation',
                    name: 'delegation',
                    type: 'tuple',
                  },
                  { internalType: 'bytes', name: 'signature', type: 'bytes' },
                ],
                internalType: 'struct SignedDelegation[]',
                name: 'authority',
                type: 'tuple[]',
              },
            ],
            internalType: 'struct Invocation[]',
            name: '_input',
            type: 'tuple[]',
          },
        ],
        name: 'GET_INVOCATION_ARRAY_PACKETHASH',
        outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
        stateMutability: 'pure',
        type: 'function',
      },
      {
        inputs: [
          {
            components: [
              {
                components: [
                  { internalType: 'address', name: 'to', type: 'address' },
                  {
                    internalType: 'uint256',
                    name: 'gasLimit',
                    type: 'uint256',
                  },
                  { internalType: 'bytes', name: 'data', type: 'bytes' },
                ],
                internalType: 'struct Transaction',
                name: 'transaction',
                type: 'tuple',
              },
              {
                components: [
                  {
                    components: [
                      {
                        internalType: 'address',
                        name: 'delegate',
                        type: 'address',
                      },
                      {
                        internalType: 'bytes32',
                        name: 'authority',
                        type: 'bytes32',
                      },
                      {
                        components: [
                          {
                            internalType: 'address',
                            name: 'enforcer',
                            type: 'address',
                          },
                          {
                            internalType: 'bytes',
                            name: 'terms',
                            type: 'bytes',
                          },
                        ],
                        internalType: 'struct Caveat[]',
                        name: 'caveats',
                        type: 'tuple[]',
                      },
                    ],
                    internalType: 'struct Delegation',
                    name: 'delegation',
                    type: 'tuple',
                  },
                  { internalType: 'bytes', name: 'signature', type: 'bytes' },
                ],
                internalType: 'struct SignedDelegation[]',
                name: 'authority',
                type: 'tuple[]',
              },
            ],
            internalType: 'struct Invocation',
            name: '_input',
            type: 'tuple',
          },
        ],
        name: 'GET_INVOCATION_PACKETHASH',
        outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
        stateMutability: 'pure',
        type: 'function',
      },
      {
        inputs: [
          {
            components: [
              { internalType: 'uint256', name: 'nonce', type: 'uint256' },
              { internalType: 'uint256', name: 'queue', type: 'uint256' },
            ],
            internalType: 'struct ReplayProtection',
            name: '_input',
            type: 'tuple',
          },
        ],
        name: 'GET_REPLAYPROTECTION_PACKETHASH',
        outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
        stateMutability: 'pure',
        type: 'function',
      },
      {
        inputs: [
          {
            components: [
              {
                components: [
                  {
                    internalType: 'address',
                    name: 'delegate',
                    type: 'address',
                  },
                  {
                    internalType: 'bytes32',
                    name: 'authority',
                    type: 'bytes32',
                  },
                  {
                    components: [
                      {
                        internalType: 'address',
                        name: 'enforcer',
                        type: 'address',
                      },
                      { internalType: 'bytes', name: 'terms', type: 'bytes' },
                    ],
                    internalType: 'struct Caveat[]',
                    name: 'caveats',
                    type: 'tuple[]',
                  },
                ],
                internalType: 'struct Delegation',
                name: 'delegation',
                type: 'tuple',
              },
              { internalType: 'bytes', name: 'signature', type: 'bytes' },
            ],
            internalType: 'struct SignedDelegation[]',
            name: '_input',
            type: 'tuple[]',
          },
        ],
        name: 'GET_SIGNEDDELEGATION_ARRAY_PACKETHASH',
        outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
        stateMutability: 'pure',
        type: 'function',
      },
      {
        inputs: [
          {
            components: [
              {
                components: [
                  {
                    internalType: 'address',
                    name: 'delegate',
                    type: 'address',
                  },
                  {
                    internalType: 'bytes32',
                    name: 'authority',
                    type: 'bytes32',
                  },
                  {
                    components: [
                      {
                        internalType: 'address',
                        name: 'enforcer',
                        type: 'address',
                      },
                      { internalType: 'bytes', name: 'terms', type: 'bytes' },
                    ],
                    internalType: 'struct Caveat[]',
                    name: 'caveats',
                    type: 'tuple[]',
                  },
                ],
                internalType: 'struct Delegation',
                name: 'delegation',
                type: 'tuple',
              },
              { internalType: 'bytes', name: 'signature', type: 'bytes' },
            ],
            internalType: 'struct SignedDelegation',
            name: '_input',
            type: 'tuple',
          },
        ],
        name: 'GET_SIGNEDDELEGATION_PACKETHASH',
        outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
        stateMutability: 'pure',
        type: 'function',
      },
      {
        inputs: [
          {
            components: [
              { internalType: 'bytes', name: 'signature', type: 'bytes' },
              {
                components: [
                  {
                    internalType: 'bytes32',
                    name: 'delegationHash',
                    type: 'bytes32',
                  },
                ],
                internalType: 'struct IntentionToRevoke',
                name: 'intentionToRevoke',
                type: 'tuple',
              },
            ],
            internalType: 'struct SignedIntentionToRevoke',
            name: '_input',
            type: 'tuple',
          },
        ],
        name: 'GET_SIGNEDINTENTIONTOREVOKE_PACKETHASH',
        outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
        stateMutability: 'pure',
        type: 'function',
      },
      {
        inputs: [
          {
            components: [
              {
                components: [
                  {
                    components: [
                      {
                        components: [
                          {
                            internalType: 'address',
                            name: 'to',
                            type: 'address',
                          },
                          {
                            internalType: 'uint256',
                            name: 'gasLimit',
                            type: 'uint256',
                          },
                          {
                            internalType: 'bytes',
                            name: 'data',
                            type: 'bytes',
                          },
                        ],
                        internalType: 'struct Transaction',
                        name: 'transaction',
                        type: 'tuple',
                      },
                      {
                        components: [
                          {
                            components: [
                              {
                                internalType: 'address',
                                name: 'delegate',
                                type: 'address',
                              },
                              {
                                internalType: 'bytes32',
                                name: 'authority',
                                type: 'bytes32',
                              },
                              {
                                components: [
                                  {
                                    internalType: 'address',
                                    name: 'enforcer',
                                    type: 'address',
                                  },
                                  {
                                    internalType: 'bytes',
                                    name: 'terms',
                                    type: 'bytes',
                                  },
                                ],
                                internalType: 'struct Caveat[]',
                                name: 'caveats',
                                type: 'tuple[]',
                              },
                            ],
                            internalType: 'struct Delegation',
                            name: 'delegation',
                            type: 'tuple',
                          },
                          {
                            internalType: 'bytes',
                            name: 'signature',
                            type: 'bytes',
                          },
                        ],
                        internalType: 'struct SignedDelegation[]',
                        name: 'authority',
                        type: 'tuple[]',
                      },
                    ],
                    internalType: 'struct Invocation[]',
                    name: 'batch',
                    type: 'tuple[]',
                  },
                  {
                    components: [
                      {
                        internalType: 'uint256',
                        name: 'nonce',
                        type: 'uint256',
                      },
                      {
                        internalType: 'uint256',
                        name: 'queue',
                        type: 'uint256',
                      },
                    ],
                    internalType: 'struct ReplayProtection',
                    name: 'replayProtection',
                    type: 'tuple',
                  },
                ],
                internalType: 'struct Invocations',
                name: 'invocations',
                type: 'tuple',
              },
              { internalType: 'bytes', name: 'signature', type: 'bytes' },
            ],
            internalType: 'struct SignedInvocation',
            name: '_input',
            type: 'tuple',
          },
        ],
        name: 'GET_SIGNEDINVOCATION_PACKETHASH',
        outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
        stateMutability: 'pure',
        type: 'function',
      },
      {
        inputs: [
          {
            components: [
              { internalType: 'address', name: 'to', type: 'address' },
              { internalType: 'uint256', name: 'gasLimit', type: 'uint256' },
              { internalType: 'bytes', name: 'data', type: 'bytes' },
            ],
            internalType: 'struct Transaction',
            name: '_input',
            type: 'tuple',
          },
        ],
        name: 'GET_TRANSACTION_PACKETHASH',
        outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
        stateMutability: 'pure',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'string', name: 'identifier', type: 'string' },
          { internalType: 'bool', name: 'isNominated', type: 'bool' },
        ],
        name: 'claimIfMember',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'string', name: 'identifier', type: 'string' },
          { internalType: 'bool', name: 'isAccused', type: 'bool' },
        ],
        name: 'claimIfPhisher',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            components: [
              {
                components: [
                  { internalType: 'address', name: 'to', type: 'address' },
                  {
                    internalType: 'uint256',
                    name: 'gasLimit',
                    type: 'uint256',
                  },
                  { internalType: 'bytes', name: 'data', type: 'bytes' },
                ],
                internalType: 'struct Transaction',
                name: 'transaction',
                type: 'tuple',
              },
              {
                components: [
                  {
                    components: [
                      {
                        internalType: 'address',
                        name: 'delegate',
                        type: 'address',
                      },
                      {
                        internalType: 'bytes32',
                        name: 'authority',
                        type: 'bytes32',
                      },
                      {
                        components: [
                          {
                            internalType: 'address',
                            name: 'enforcer',
                            type: 'address',
                          },
                          {
                            internalType: 'bytes',
                            name: 'terms',
                            type: 'bytes',
                          },
                        ],
                        internalType: 'struct Caveat[]',
                        name: 'caveats',
                        type: 'tuple[]',
                      },
                    ],
                    internalType: 'struct Delegation',
                    name: 'delegation',
                    type: 'tuple',
                  },
                  { internalType: 'bytes', name: 'signature', type: 'bytes' },
                ],
                internalType: 'struct SignedDelegation[]',
                name: 'authority',
                type: 'tuple[]',
              },
            ],
            internalType: 'struct Invocation[]',
            name: 'batch',
            type: 'tuple[]',
          },
        ],
        name: 'contractInvoke',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [],
        name: 'domainHash',
        outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'bytes', name: 'terms', type: 'bytes' },
          {
            components: [
              { internalType: 'address', name: 'to', type: 'address' },
              { internalType: 'uint256', name: 'gasLimit', type: 'uint256' },
              { internalType: 'bytes', name: 'data', type: 'bytes' },
            ],
            internalType: 'struct Transaction',
            name: 'transaction',
            type: 'tuple',
          },
          { internalType: 'bytes32', name: 'delegationHash', type: 'bytes32' },
        ],
        name: 'enforceCaveat',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            components: [
              { internalType: 'address', name: 'delegate', type: 'address' },
              { internalType: 'bytes32', name: 'authority', type: 'bytes32' },
              {
                components: [
                  {
                    internalType: 'address',
                    name: 'enforcer',
                    type: 'address',
                  },
                  { internalType: 'bytes', name: 'terms', type: 'bytes' },
                ],
                internalType: 'struct Caveat[]',
                name: 'caveats',
                type: 'tuple[]',
              },
            ],
            internalType: 'struct Delegation',
            name: 'delegation',
            type: 'tuple',
          },
        ],
        name: 'getDelegationTypedDataHash',
        outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'string', name: 'contractName', type: 'string' },
          { internalType: 'string', name: 'version', type: 'string' },
          { internalType: 'uint256', name: 'chainId', type: 'uint256' },
          {
            internalType: 'address',
            name: 'verifyingContract',
            type: 'address',
          },
        ],
        name: 'getEIP712DomainHash',
        outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
        stateMutability: 'pure',
        type: 'function',
      },
      {
        inputs: [
          {
            components: [
              {
                internalType: 'bytes32',
                name: 'delegationHash',
                type: 'bytes32',
              },
            ],
            internalType: 'struct IntentionToRevoke',
            name: 'intentionToRevoke',
            type: 'tuple',
          },
        ],
        name: 'getIntentionToRevokeTypedDataHash',
        outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            components: [
              {
                components: [
                  {
                    components: [
                      { internalType: 'address', name: 'to', type: 'address' },
                      {
                        internalType: 'uint256',
                        name: 'gasLimit',
                        type: 'uint256',
                      },
                      { internalType: 'bytes', name: 'data', type: 'bytes' },
                    ],
                    internalType: 'struct Transaction',
                    name: 'transaction',
                    type: 'tuple',
                  },
                  {
                    components: [
                      {
                        components: [
                          {
                            internalType: 'address',
                            name: 'delegate',
                            type: 'address',
                          },
                          {
                            internalType: 'bytes32',
                            name: 'authority',
                            type: 'bytes32',
                          },
                          {
                            components: [
                              {
                                internalType: 'address',
                                name: 'enforcer',
                                type: 'address',
                              },
                              {
                                internalType: 'bytes',
                                name: 'terms',
                                type: 'bytes',
                              },
                            ],
                            internalType: 'struct Caveat[]',
                            name: 'caveats',
                            type: 'tuple[]',
                          },
                        ],
                        internalType: 'struct Delegation',
                        name: 'delegation',
                        type: 'tuple',
                      },
                      {
                        internalType: 'bytes',
                        name: 'signature',
                        type: 'bytes',
                      },
                    ],
                    internalType: 'struct SignedDelegation[]',
                    name: 'authority',
                    type: 'tuple[]',
                  },
                ],
                internalType: 'struct Invocation[]',
                name: 'batch',
                type: 'tuple[]',
              },
              {
                components: [
                  { internalType: 'uint256', name: 'nonce', type: 'uint256' },
                  { internalType: 'uint256', name: 'queue', type: 'uint256' },
                ],
                internalType: 'struct ReplayProtection',
                name: 'replayProtection',
                type: 'tuple',
              },
            ],
            internalType: 'struct Invocations',
            name: 'invocations',
            type: 'tuple',
          },
        ],
        name: 'getInvocationsTypedDataHash',
        outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            components: [
              {
                components: [
                  {
                    components: [
                      {
                        components: [
                          {
                            internalType: 'address',
                            name: 'to',
                            type: 'address',
                          },
                          {
                            internalType: 'uint256',
                            name: 'gasLimit',
                            type: 'uint256',
                          },
                          {
                            internalType: 'bytes',
                            name: 'data',
                            type: 'bytes',
                          },
                        ],
                        internalType: 'struct Transaction',
                        name: 'transaction',
                        type: 'tuple',
                      },
                      {
                        components: [
                          {
                            components: [
                              {
                                internalType: 'address',
                                name: 'delegate',
                                type: 'address',
                              },
                              {
                                internalType: 'bytes32',
                                name: 'authority',
                                type: 'bytes32',
                              },
                              {
                                components: [
                                  {
                                    internalType: 'address',
                                    name: 'enforcer',
                                    type: 'address',
                                  },
                                  {
                                    internalType: 'bytes',
                                    name: 'terms',
                                    type: 'bytes',
                                  },
                                ],
                                internalType: 'struct Caveat[]',
                                name: 'caveats',
                                type: 'tuple[]',
                              },
                            ],
                            internalType: 'struct Delegation',
                            name: 'delegation',
                            type: 'tuple',
                          },
                          {
                            internalType: 'bytes',
                            name: 'signature',
                            type: 'bytes',
                          },
                        ],
                        internalType: 'struct SignedDelegation[]',
                        name: 'authority',
                        type: 'tuple[]',
                      },
                    ],
                    internalType: 'struct Invocation[]',
                    name: 'batch',
                    type: 'tuple[]',
                  },
                  {
                    components: [
                      {
                        internalType: 'uint256',
                        name: 'nonce',
                        type: 'uint256',
                      },
                      {
                        internalType: 'uint256',
                        name: 'queue',
                        type: 'uint256',
                      },
                    ],
                    internalType: 'struct ReplayProtection',
                    name: 'replayProtection',
                    type: 'tuple',
                  },
                ],
                internalType: 'struct Invocations',
                name: 'invocations',
                type: 'tuple',
              },
              { internalType: 'bytes', name: 'signature', type: 'bytes' },
            ],
            internalType: 'struct SignedInvocation[]',
            name: 'signedInvocations',
            type: 'tuple[]',
          },
        ],
        name: 'invoke',
        outputs: [{ internalType: 'bool', name: 'success', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [{ internalType: 'string', name: '', type: 'string' }],
        name: 'isMember',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [{ internalType: 'string', name: '', type: 'string' }],
        name: 'isPhisher',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: '', type: 'address' },
          { internalType: 'uint256', name: '', type: 'uint256' },
        ],
        name: 'multiNonce',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'owner',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'renounceOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            components: [
              {
                components: [
                  {
                    internalType: 'address',
                    name: 'delegate',
                    type: 'address',
                  },
                  {
                    internalType: 'bytes32',
                    name: 'authority',
                    type: 'bytes32',
                  },
                  {
                    components: [
                      {
                        internalType: 'address',
                        name: 'enforcer',
                        type: 'address',
                      },
                      { internalType: 'bytes', name: 'terms', type: 'bytes' },
                    ],
                    internalType: 'struct Caveat[]',
                    name: 'caveats',
                    type: 'tuple[]',
                  },
                ],
                internalType: 'struct Delegation',
                name: 'delegation',
                type: 'tuple',
              },
              { internalType: 'bytes', name: 'signature', type: 'bytes' },
            ],
            internalType: 'struct SignedDelegation',
            name: 'signedDelegation',
            type: 'tuple',
          },
          {
            components: [
              { internalType: 'bytes', name: 'signature', type: 'bytes' },
              {
                components: [
                  {
                    internalType: 'bytes32',
                    name: 'delegationHash',
                    type: 'bytes32',
                  },
                ],
                internalType: 'struct IntentionToRevoke',
                name: 'intentionToRevoke',
                type: 'tuple',
              },
            ],
            internalType: 'struct SignedIntentionToRevoke',
            name: 'signedIntentionToRevoke',
            type: 'tuple',
          },
        ],
        name: 'revokeDelegation',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: 'newOwner', type: 'address' },
        ],
        name: 'transferOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            components: [
              {
                components: [
                  {
                    internalType: 'address',
                    name: 'delegate',
                    type: 'address',
                  },
                  {
                    internalType: 'bytes32',
                    name: 'authority',
                    type: 'bytes32',
                  },
                  {
                    components: [
                      {
                        internalType: 'address',
                        name: 'enforcer',
                        type: 'address',
                      },
                      { internalType: 'bytes', name: 'terms', type: 'bytes' },
                    ],
                    internalType: 'struct Caveat[]',
                    name: 'caveats',
                    type: 'tuple[]',
                  },
                ],
                internalType: 'struct Delegation',
                name: 'delegation',
                type: 'tuple',
              },
              { internalType: 'bytes', name: 'signature', type: 'bytes' },
            ],
            internalType: 'struct SignedDelegation',
            name: 'signedDelegation',
            type: 'tuple',
          },
        ],
        name: 'verifyDelegationSignature',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            components: [
              { internalType: 'bytes', name: 'signature', type: 'bytes' },
              {
                components: [
                  {
                    internalType: 'bytes32',
                    name: 'delegationHash',
                    type: 'bytes32',
                  },
                ],
                internalType: 'struct IntentionToRevoke',
                name: 'intentionToRevoke',
                type: 'tuple',
              },
            ],
            internalType: 'struct SignedIntentionToRevoke',
            name: 'signedIntentionToRevoke',
            type: 'tuple',
          },
        ],
        name: 'verifyIntentionToRevokeSignature',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            components: [
              {
                components: [
                  {
                    components: [
                      {
                        components: [
                          {
                            internalType: 'address',
                            name: 'to',
                            type: 'address',
                          },
                          {
                            internalType: 'uint256',
                            name: 'gasLimit',
                            type: 'uint256',
                          },
                          {
                            internalType: 'bytes',
                            name: 'data',
                            type: 'bytes',
                          },
                        ],
                        internalType: 'struct Transaction',
                        name: 'transaction',
                        type: 'tuple',
                      },
                      {
                        components: [
                          {
                            components: [
                              {
                                internalType: 'address',
                                name: 'delegate',
                                type: 'address',
                              },
                              {
                                internalType: 'bytes32',
                                name: 'authority',
                                type: 'bytes32',
                              },
                              {
                                components: [
                                  {
                                    internalType: 'address',
                                    name: 'enforcer',
                                    type: 'address',
                                  },
                                  {
                                    internalType: 'bytes',
                                    name: 'terms',
                                    type: 'bytes',
                                  },
                                ],
                                internalType: 'struct Caveat[]',
                                name: 'caveats',
                                type: 'tuple[]',
                              },
                            ],
                            internalType: 'struct Delegation',
                            name: 'delegation',
                            type: 'tuple',
                          },
                          {
                            internalType: 'bytes',
                            name: 'signature',
                            type: 'bytes',
                          },
                        ],
                        internalType: 'struct SignedDelegation[]',
                        name: 'authority',
                        type: 'tuple[]',
                      },
                    ],
                    internalType: 'struct Invocation[]',
                    name: 'batch',
                    type: 'tuple[]',
                  },
                  {
                    components: [
                      {
                        internalType: 'uint256',
                        name: 'nonce',
                        type: 'uint256',
                      },
                      {
                        internalType: 'uint256',
                        name: 'queue',
                        type: 'uint256',
                      },
                    ],
                    internalType: 'struct ReplayProtection',
                    name: 'replayProtection',
                    type: 'tuple',
                  },
                ],
                internalType: 'struct Invocations',
                name: 'invocations',
                type: 'tuple',
              },
              { internalType: 'bytes', name: 'signature', type: 'bytes' },
            ],
            internalType: 'struct SignedInvocation',
            name: 'signedInvocation',
            type: 'tuple',
          },
        ],
        name: 'verifyInvocationSignature',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
      },
    ];

    const provider = new ethers.providers.Web3Provider(wallet);

    const mobyMaskContract = new ethers.Contract(
      mobyMaskAddress,
      mobyMaskABI,
      provider,
    );

    let ethersReadResult = false;

    if (transaction.to === mobyMaskAddress.toLowerCase()) {
      // User is interacting with MobyMask contract

      const transactionData = remove0x(transaction.data);

      const functionSignature = transactionData.slice(0, 8);

      if (
        functionSignature === '6b6dc9de' ||
        functionSignature === '463a3ce4'
      ) {
        // User is calling "claimIfPhisher" or "claimIfMember"

        const parameterTypes = ['string', 'bool'];

        const decodedParameters = decode(
          parameterTypes,
          add0x(transactionData.slice(8)),
        );

        if (functionSignature === '6b6dc9de') {
          ethersReadResult = await mobyMaskContract.isPhisher(
            decodedParameters[0],
          );

          if (ethersReadResult) {
            returnObject.Notice = 'This phisher has already been reported.';
          }
        } else {
          ethersReadResult = await mobyMaskContract.isMember(
            decodedParameters[0],
          );

          if (ethersReadResult) {
            returnObject.Notice = 'This user is already a member.';
          }
        }
      }
    } else {
      // Check if the user is interacting with a phisher
      ethersReadResult = await mobyMaskContract.isPhisher(
        `eip155:1:${transaction.to}`,
      );

      if (ethersReadResult) {
        returnObject.Warning = 'You are interacting with a known phisher.';
      }
    }

    return returnObject;
  } catch (error) {
    console.error(error);
    return returnObject;
  }
}
