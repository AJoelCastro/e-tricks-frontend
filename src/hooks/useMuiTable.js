import { useState } from 'react';
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}
export function getComparator(order, orderBy) {
  return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
export function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

// ==============================================================

// ==============================================================

export default function useMuiTable(props) {
  const [order, setOrder] = useState(props.defaultOrder || 'asc');
  const [orderBy, setOrderBy] = useState(props.defaultOrderBy || 'name');
  const [selected, setSelected] = useState(props.defaultSelected || []);
  const [page, setPage] = useState(props.defaultPage || 0);
  const [rowsPerPage, setRowsPerPage] = useState(props.defaultRowsPerPage || 5);
  const handleRequestSort = (_, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  const handleSelectAllRows = newSelected => event => {
    if (event?.target.checked) {
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };
  const handleSelectRow = (_, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };
  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const isSelected = id => selected.indexOf(id) !== -1;
  const emptyRows = (page, rowsPerPage, dataLength) => page > 0 ? Math.max(0, (1 + page) * rowsPerPage - dataLength) : 0;
  return {
    page,
    order,
    setPage,
    orderBy,
    rowsPerPage,
    selected,
    isSelected,
    setSelected,
    emptyRows,
    handleSelectRow,
    handleChangePage,
    handleRequestSort,
    handleSelectAllRows,
    handleChangeRowsPerPage
  };
}