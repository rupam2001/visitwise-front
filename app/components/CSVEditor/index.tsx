import * as React from "react";
import { CSVLink, CSVDownload } from "react-csv";

interface CSVEditorProps {
  content: string;
}

const CSVEditor: React.FC<CSVEditorProps> = ({ content }) => {
  const [processedContent, setProcessedContent] = React.useState<string[][]>([
    [],
  ]);

  React.useEffect(() => {
    setProcessedContent(prepare(content));
  }, [content]);

  const prepare = (text: string) => {
    let lines: string[] = text.split("\n");
    let table = lines.map((l) => l.split(","));
    return table;
  };

  const gridContainerStyle = () => ({
    display: "grid",
    gridTemplateColumns: `repeat(${processedContent[0].length}, 0fr)`,
    // gridGap: "10px",
  });

  const gridItemStyle = {
    border: "1px solid #ccc",
    padding: "10px",
  };
  const onChangeCell = (value: string, row_num: number, col_num: number) => {
    setProcessedContent((c) => {
      let temp = [...processedContent];
      temp[row_num][col_num] = value;
      return temp;
    });
  };
  const computeColWidth = (csv: string[][], col_num: number) => {
    let max = 0;
    for (let i = 0; i < csv.length; i++) {
      if (csv[i][col_num]) max = Math.max(max, csv[i][col_num].length);
    }
    if (max < 5) return max * 2;
    return max;
  };

  const getHeaders = () => {
    return [
      ...processedContent[0].map((cell) => ({ name: cell, selected: true })),
    ];
  };

  const [options, setOptions] = React.useState([
    { name: "Not selected", selected: false },
    { name: "First name", selected: false },
    { name: "Last name", selected: false },
    { name: "Email", selected: false },
    { name: "Role", selected: false },
    { name: "Phone", selected: false },
    { name: "Designation", selected: false },
    { name: "Reports to", selected: false },
  ]);

  const headers = React.useMemo(() => [...getHeaders()], []);

  const onSelectHeaderColumn = (value: string, col_num: number) => {
    //
    setOptions((o) => {
      let temp = [...options];
      temp.forEach((t) => {
        if (t.name == value) {
          t.selected = true;
        }
      });
      return temp;
    });
  };

  return (
    <div className="">
      {/*  */}
      <div
        className="w-full h-screen overflow-auto  rounded-lg"
        //   style={{ width: "100%" }}
      >
        {processedContent
          .slice(0, processedContent.length)
          .map((row, row_num) => {
            if (row.length && row.reduce((p, c) => p.trim() + c.trim()) == "")
              return; // remove the empty rows
            if (row_num == 0)
              return (
                <div
                  style={gridContainerStyle()}
                  className="border-b-2 border-gray-200"
                  key={row_num}
                >
                  {row.map((cell, col_num) => (
                    <div
                      className=" p-2 text-center "
                      style={{
                        width: `${computeColWidth(
                          processedContent,
                          col_num
                        )}rem`,
                        textWrap: "nowrap",
                        overflowX: "auto",
                        border: "1px solid gray",
                      }}
                      key={row_num + col_num + cell}
                    >
                      <div className="text-gray-300">
                        {headers[col_num]?.name}
                      </div>
                      <select
                        className="select w-full max-w-xs text-green-600"
                        onChange={(e) => {
                          onSelectHeaderColumn(e.target.value, col_num);
                        }}
                      >
                        {[...options].map((op) => (
                          <option key={op.name}>{op?.name}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              );

            return (
              <div
                style={gridContainerStyle()}
                className="border-b-2 border-gray-200"
                key={row_num}
              >
                {row.map((cell, col_num) => (
                  <div
                    className=" p-2 text-center "
                    contentEditable={true}
                    style={{
                      width: `${computeColWidth(processedContent, col_num)}rem`,
                      textWrap: "nowrap",
                      overflowX: "auto",
                      border: "1px solid gray",
                    }}
                    onInput={(e) => {
                      onChangeCell(
                        e.currentTarget.textContent
                          ? (e.currentTarget.textContent as string)
                          : "",
                        row_num,
                        col_num
                      );
                    }}
                    key={row_num + col_num + cell}
                  >
                    {cell}
                  </div>
                ))}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default CSVEditor;
