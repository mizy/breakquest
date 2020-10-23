// TypeScript file

const util = {
    getVectorLength:(arr:Array<number>):number=>{
        return Math.sqrt(arr[0]*arr[0] + arr[1]*arr[1])
    },

    dot:(arr:Array<number>,arr1:Array<number>):number=>{
        return arr[0]*arr1[0] + arr[1]*arr1[1]
    },

    addVector:(arr:Array<number>,arr1:Array<number>):Array<number>=>{
        return [arr[0]+arr1[0],arr[1]+arr1[1]]
    },

    multiplyFloat:(arr:number[],val:number):number[]=>{
        return [arr[0]*val,arr[1]*val]
    },
    subVector:(arr:Array<number>,arr1:Array<number>):Array<number>=>{
        return [arr[0]-arr1[0],arr[1]-arr1[1]]
    },

    normalize:(arr)=>{
        const length = util.getVectorLength(arr);
        return [arr[0]/length,arr[1]/length];
    }
} 