// eslint-disable-next-line @typescript-eslint/no-var-requires
const Manager = require('../build/main/Deploy/CreateManager').default;

describe('Asserts', () => {
  let manager;
  beforeEach(async () => {
    manager = new Manager();
    await manager.CreateClient(['http://localhost:8080/graphql']);
    await manager.createKeys();
    manager.loadContract(
      './tests/contract/InitParams.tvc',
      './tests/contract/InitParams.abi.json'
    );
    manager.loadContract(
      './tests/contract/9_PiggyBank.tvc',
      './tests/contract/9_PiggyBank.abi.json'
    );
    manager.loadContract(
      './tests/contract/9_PiggyBank_Owner.tvc',
      './tests/contract/9_PiggyBank_Owner.abi.json'
    );
    manager.loadContract(
      './tests/contract/9_PiggyBank_Stranger.tvc',
      './tests/contract/9_PiggyBank_Stranger.abi.json'
    );
    await manager.contracts['InitParams'].DeployContract();
    await manager.contracts['9_PiggyBank_Owner'].DeployContract();
    await manager.contracts['9_PiggyBank_Stranger'].DeployContract();
    await manager.contracts['9_PiggyBank'].DeployContract({
      own: manager.contracts['9_PiggyBank_Owner'].address,
      lim: 1000000,
    });
  });

  it('test one', async () => {
    await manager.contracts['9_PiggyBank_Owner'].RunContract('addToDeposit', {
      bankAddress: manager.contracts['9_PiggyBank'].address,
      amount: 100000,
    });
    console.log('AddDeposit 1000');
    manager.GiveToAddress(manager.contracts['9_PiggyBank'].address);
    let res = await manager.contracts['9_PiggyBank'].RunContract('getData', {});
    console.log(res);
  });
});