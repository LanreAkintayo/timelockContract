const { expect } = require("chai");
const { ethers } = require("hardhat");
const increaseTimeTo = require("../utils/increaseTimeTo")
const duration = require("../utils/duration")
const ether = require("../utils/ether")
const currentTime = require("../utils/currentTime")


const chai = require("chai");
const BN = require("bn.js");
const should = require("chai").should();

chai.use(require("chai-bn")(BN));
chai.use(require("chai-as-promised"));


describe("Setting Timestamp", async function () {
  before(async () => {
    const TimeLock = await ethers.getContractFactory("TimeLock");
    this.timeLock = await TimeLock.deploy();
    await this.timeLock.deployed();

    this.signers = await ethers.getSigners();
    this.signer1 = this.signers[0];
    this.signer2 = this.signers[1];

    const now = await currentTime();
    console.log(`Now: ${now}`);

    this.startingTime = now + duration.days(1);

    console.log(`Starting Time: ${this.startingTime}`);

    this.closingTime = this.startingTime + duration.days(3);
    console.log(`Closing Time: ${this.closingTime}`);
  });

  it("should set opening and closing time", async () => {
    tx = await this.timeLock.setTimeStamp(this.startingTime, this.closingTime);
    const receipt = await tx.wait(1);

    // console.log(receipt);

    console.log(receipt.events[0].topics[1].toString())
  });

  it("should store eth in the contract", async () => {
    await this.timeLock.store({ from: this.signer1.address, value: ether(2) });

    const account1Balance = await this.timeLock.balance(this.signer1.address);

    expect(account1Balance.toString()).to.equal(ether(2).toString());

    await this.timeLock.connect(this.signer2).store({ value: ether(4) });

    const account2Balance = await this.timeLock.balance(this.signer2.address);

    expect(account2Balance.toString()).to.equal(ether(4).toString());
  });

  it("should lock contract when timestamp elapse", async () => {
    await this.timeLock.connect(this.signer1).withdraw(ether(1)).should.be
      .fulfilled;

    const signer1Balance = await this.timeLock.balance(this.signer1.address);

   expect(signer1Balance.toString()).to.equal(ether(1).toString());
   

    increaseTimeTo(this.startingTime + 1);

    const time = await currentTime();

    await this.timeLock
      .connect(this.signer1)
      .withdraw(ether(1))
      .should.be.rejectedWith("revert");
    
    increaseTimeTo(this.closingTime + 1);

    await this.timeLock
      .connect(this.signer1)
      .withdraw(ether(1))
      .should.be.fulfilled;
    
    const newSigner1Balance = await this.timeLock.balance(this.signer1.address)
    const signer2Balance = await this.timeLock.balance(this.signer2.address)

    expect(newSigner1Balance.toString()).to.equal("0")
    expect(signer2Balance.toString()).to.equal(ether(4).toString())

  });
});

