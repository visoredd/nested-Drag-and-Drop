import "./styles.css";
import React, { useState } from 'react';
import {
  DndContext,
  useDraggable,
  useDroppable,
  closestCenter,
  DragOverlay,
} from '@dnd-kit/core';
import { findItem, removeItem, insertItem, isDescendant } from './utils';

const initialData = [
  {
    id: '1',
    label: 'Item 1',
    children: [
      { id: '1-1', label: 'Item 1.1', children: [] },
      {
        id: '1-2',
        label: 'Item 1.2',
        children: [
          {
            id: '1-2-1',
            label: 'Item 1.2.1',
            children: [],
          },
        ],
      },
    ],
  },
  {
    id: '2',
    label: 'Item 2',
    children: [
      {
        id: '2-1',
        label: 'Item 2.1',
        children: [],
      },
    ],
  },
  {
    id: '3',
    label: 'Item 3',
    children: [],
  },
  {
    id: '4',
    label: 'Item 4',
    children: [
      {
        id: '4-1',
        label: 'Item 4.1',
        children: [
          {
            id: '4-1-1',
            label: 'Item 4.1.1',
            children: [
              {
                id: '4-1-1-1',
                label: 'Item 4.1.1.1',
                children: [],
              },
            ],
          },
        ],
      },
    ],
  },
];


export default function App() {
  const [items, setItems] = useState(initialData);
  const [activeId, setActiveId] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);

  const handleDragStart = ({ active }) => {
    setActiveId(active.id);
    setDraggedItem(findItem(items, active.id));
  };

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;

    const dragged = findItem(items, active.id);
    const target = findItem(items, over.id);

    if (isDescendant(dragged, over.id)) {
      alert("Can't move item into its own descendant");
      return;
    }

    let newTree = removeItem(items, active.id);
    newTree = insertItem(newTree, over.id, dragged);
    setItems(newTree);
    setActiveId(null);
    setDraggedItem(null);
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <List items={items} />
      <DragOverlay>
        {draggedItem ? (
          <div
            style={{
              padding: '8px 12px',
              backgroundColor: '#fff',
              border: '2px solid #007bff',
              borderRadius: '4px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              fontWeight: 'bold',
              cursor: 'grabbing',
            }}
          >
            {draggedItem.label}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

function List({ items }) {
  return (
    <ul style={{ paddingLeft: 20 }}>
      {items.map((item) => (
        <ListItem key={item.id} item={item} />
      ))}
    </ul>
  );
}

function ListItem({ item }) {
  const { attributes, listeners, setNodeRef: dragRef } = useDraggable({
    id: item.id,
  });

  const { isOver, setNodeRef: dropRef } = useDroppable({ id: item.id });

  return (
    <li ref={dropRef} style={{ marginBottom: 5 }}>
      <div
        ref={dragRef}
        {...listeners}
        {...attributes}
        style={{
          border: isOver ? '2px dashed #007bff' : '1px solid #999',
          padding: '5px 10px',
          backgroundColor: isOver ? '#e6f0ff' : '#eee',
          borderRadius: 4,
          cursor: 'grab',
          transition: 'all 0.15s ease-in-out',
        }}
      >
        {item.label}
      </div>
      {item.children?.length > 0 && <List items={item.children} />}
    </li>
  );
}