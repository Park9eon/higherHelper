const _ = require('lodash');
const readline = require('readline');
const data = require('./data');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const readLineSync = async (message) => {
    const readLineAsync = () => {
        return new Promise((resolve) => {
            rl.question(message, (answer) => {
                resolve(answer);
            });
        });
    };
    const answer = await readLineAsync();
    return answer;
};

class Watcher {
    constructor(data) {
        this.data = data;
        this.left = null;
        this.right = null;
    }

    findByName(name) {
        return _.find(this.data, (_) => _.name === name) || null;
    }

    next(name) {
        this.left = this.right || this.left;
        this.right = this.findByName(name);
        return this.right;
    }

    isHigher() {
        if (this.left && this.right) {
            return this.left.count < this.right.count;
        } else {
            return null;
        }
    }
}

const watcher = new Watcher(data);
(async () => {
    for (let i = 0; i < data.length ; i++) {
        try {
            const name = await readLineSync(`이름을 입력해주세요(${i}) : `);
            const right = watcher.next(name);
            if (right) {
                const isHigher = watcher.isHigher();
                console.log(`이름 : ${name} / 검색횟수 : ${right.count}`);
                if (isHigher !== null) {
                    if (isHigher) {
                        console.log('결과 : \x1b[32m%s\x1b[0m', '더 많이');
                    } else {
                        console.log('결과 : \x1b[31m%s\x1b[0m', '더 적게');
                    }
                }
            } else {
                console.error(`찾을 수 없습니다. 다시 입력해주세요.`);
                i--;
            }
        } catch (e) {
            console.log(e);
        }
    }
    rl.close();
})();


