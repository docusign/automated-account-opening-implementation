import { IComparisonOperation, ILogicalOperation, IOperand, IQuery, OperandType, OperationUnion } from "../models/IQuery";

export type KeyValuePair = { key: string; value: string };

function isLogicalOperation(op: OperationUnion): op is ILogicalOperation {
  return (op as ILogicalOperation).leftOperation !== undefined
      && (op as ILogicalOperation).rightOperation !== undefined;
}

function isComparisonOperation(op: OperationUnion): op is IComparisonOperation {
  return (op as IComparisonOperation).leftOperand !== undefined
      && (op as IComparisonOperation).rightOperand !== undefined;
}

function operandValueToString(operand: IOperand): string {
    const raw = operand.name ?? "";

    switch (operand.type) {
        case OperandType.DATETIME:
            return String(raw).trim();

        case OperandType.INTEGER:
        case OperandType.DOUBLE: {
            return String(raw).trim();
        }

        case OperandType.LIST:
            return String(raw).trim();

        default:
            return String(raw).trim();
    }
}

export function extractPairs(input: IQuery): KeyValuePair[] {
    const pairs: KeyValuePair[] = [];
    
    const root = input.queryFilter.operation;
    if (!root) {
        return pairs;
    }

    const visit = (op: OperationUnion) => {
        if (isLogicalOperation(op)) {
            visit(op.leftOperation);
            visit(op.rightOperation);
            return;
        }

        if (!isComparisonOperation(op)) return;

        const left = op.leftOperand;
        const right = op.rightOperand;

        if (!left.isLiteral && right.isLiteral) {
            pairs.push({
                key: left.name,
                value: operandValueToString(right),
            });
            return;
        }

        if (left.isLiteral && !right.isLiteral) {
            pairs.push({
                key: right.name,
                value: operandValueToString(left),
            });
            return;
        }
    };

    visit(root);
    return pairs;
}