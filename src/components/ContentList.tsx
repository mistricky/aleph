import dayjs from 'dayjs'
import { Box, Button, Markdown, Text, Image } from 'grommet'
import { Episode, Source } from '../types'
import TurndownService from 'turndown'
import { ClearOption } from 'grommet-icons'
import Launch from '../assets/launch.png'
import { useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { isContained } from '../utils/format'

const turndownService = new TurndownService()

export default function ContentList({
  itemList,
  activeSource,
  activeItem,
  setActiveItem,
}: {
  itemList: Episode[]
  activeSource: Source
  activeItem: Episode | undefined
  setActiveItem: (digest: Episode | undefined) => void
}) {
  const dispatch = useAppDispatch()
  const vieweds = useAppSelector((state) => state.item.vieweds)
  const listContainer = useRef(null)
  const sourceItemList = itemList.filter((t) => t.source === activeSource.name)

  useEffect(() => {
    if (listContainer && listContainer.current) {
      ;(listContainer.current as any).scrollTo(0, 0)
    }
  }, [activeSource])

  console.log(sourceItemList)

  return (
    <Box width="300px" background="light-1">
      <Box direction="row" height="40px" align="center" justify="end">
        <Button
          icon={<ClearOption />}
          a11yTitle="Read All"
          onClick={() => {
            dispatch({ type: 'item/readAll', payload: sourceItemList })
          }}
        />
      </Box>

      {sourceItemList.length === 0 ? (
        <Box height="100%" align="center" justify="end">
          <Image
            src={Launch}
            width="100px"
            style={{ opacity: 0.7 }}
            alt=""
            className="launch-image"
          />
        </Box>
      ) : (
        <Box
          height="calc(100vh - 40px)"
          style={{ overflowY: 'scroll' }}
          ref={listContainer}
        >
          {sourceItemList.slice(0, 50).map((item) => {
            const digest = turndownService.turndown(item?.description || '')
            let isActive = false
            if (item.guid) {
              isActive = item.guid === activeItem?.guid
            } else if (item.link) {
              isActive = item.link === activeItem?.link
            }
            return (
              <Box
                key={item.title}
                pad={{ vertical: 'xsmall', horizontal: 'small' }}
                style={{
                  minHeight: 'unset',
                  cursor: 'pointer',
                  boxShadow: 'none',
                  opacity: isContained(item, vieweds) ? 0.7 : 1,
                }}
                border={{ side: 'bottom', size: 'xsmall', color: 'light-4' }}
                background={isActive ? 'neutral-3' : ''}
                onClick={() => setActiveItem(item)}
              >
                <Text size="small" weight="bolder">
                  {item.title}
                </Text>
                <Text size="xsmall" color="dark-6">
                  {dayjs(item.pubDate).format('YYYY-MM-DD HH:mm')}
                </Text>
                <Markdown className="markdown-digest">{digest}</Markdown>
              </Box>
            )
          })}
        </Box>
      )}
    </Box>
  )
}
